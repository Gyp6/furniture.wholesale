<#
.SYNOPSIS
  Runs a SonarQube analysis of the Gyp6.sale frontend and prints the Quality Gate result.

.DESCRIPTION
  Task 1 automation script (Lab 1 "Automated quality control").
  1. Checks that the local SonarQube server (Docker, http://localhost:9000) is UP.
  2. Runs the scanner (@sonar/scan via npx, downloads its own JRE) with sonar-project.properties.
  3. Waits for the Compute Engine task and prints Quality Gate status + key metrics.

.EXAMPLE
  $env:SONAR_TOKEN = "squ_xxx"
  .\scripts\sonar-scan.ps1 -Version 1.1
#>
param(
  [string]$Version = "",
  [string]$HostUrl = "http://localhost:9000",
  [string]$ProjectKey = "lab1-quality",
  [string]$Token = $env:SONAR_TOKEN
)

$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

if (-not $Token) { throw "Set SONAR_TOKEN (My Account > Security > Generate token) or pass -Token." }
$auth = @{ Authorization = "Basic " + [Convert]::ToBase64String([Text.Encoding]::ASCII.GetBytes("${Token}:")) }

# 1. Server health
try {
  $status = (Invoke-RestMethod "$HostUrl/api/system/status").status
} catch { $status = "DOWN" }
if ($status -ne "UP") {
  throw "SonarQube is not UP ($status). Start it: docker start sonarqube"
}

# 2. Scan
$scanArgs = @("--yes", "@sonar/scan", "-Dsonar.host.url=$HostUrl", "-Dsonar.token=$Token")
if ($Version) { $scanArgs += "-Dsonar.projectVersion=$Version" }
Write-Host ">> npx $($scanArgs -join ' ' -replace [regex]::Escape($Token), '***')" -ForegroundColor Cyan
& npx @scanArgs
$scanExit = $LASTEXITCODE   # non-zero when Quality Gate is FAILED (sonar.qualitygate.wait=true)

# 3. Report
$qg = Invoke-RestMethod -Headers $auth "$HostUrl/api/qualitygates/project_status?projectKey=$ProjectKey"
$keys = "bugs,vulnerabilities,security_hotspots,code_smells,sqale_index,duplicated_lines_density,complexity,cognitive_complexity,coverage,ncloc"
$m = Invoke-RestMethod -Headers $auth "$HostUrl/api/measures/component?component=$ProjectKey&metricKeys=$keys"

$color = if ($qg.projectStatus.status -eq "OK") { "Green" } else { "Red" }
Write-Host "`nQuality Gate: $($qg.projectStatus.status)" -ForegroundColor $color
$qg.projectStatus.conditions | ForEach-Object {
  "{0,-45} {1,-6} actual={2} threshold={3}" -f $_.metricKey, $_.status, $_.actualValue, $_.errorThreshold
}
Write-Host "`nMetrics:"
$m.component.measures | Sort-Object metric | ForEach-Object { "{0,-28} {1}" -f $_.metric, $_.value }
exit $scanExit
