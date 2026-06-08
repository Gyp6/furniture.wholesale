include .env
export

export PROJECT_ROOT=.

env-up:
	docker compose -f deploy/docker-compose.yaml up -d

env-down:
	docker compose -f deploy/docker-compose.yaml down
	
redis-up:
	docker compose -f deploy/docker-compose.yaml up -d redis

prod-up:
	docker compose -f deploy/docker-compose.prod.yaml up -d

prod-down:
	docker compose -f deploy/docker-compose.prod.yaml down
	
prod-rebuild:
	@echo "Hard rebuilding all Docker images without cache..."
	docker compose -f docker-compose.prod.yaml build --no-cache
	@echo "Starting containers..."
	docker compose -f docker-compose.prod.yaml up -d --force-recreate

env-cleanup-postgres:
	@read -p "Cleanup postgres volume files? Danger to lose data. [y/N]: "ans; \
	if [ "$$ans" = "y" ]; then \
		docker compose down && \
		rm -rf out/pg-data && \
		echo "Cleanup postgres volume files finished successfully"; \
	else \
		echo "Cancelled to cleanup postgres volume files"; \
	fi

env-cleanup-postgres-windows:
	@powershell -Command "\
		$$ans = Read-Host 'Cleanup postgres volume files? Danger to lose data. [y/N]'; \
		if ($$ans -eq 'y') { \
			docker compose down; \
			if (Test-Path ./out/pg-data) { Remove-Item -Recurse -Force ./out/pg-data }; \
			Write-Host 'Cleanup postgres volume files finished successfully' -ForegroundColor Green; \
		} else { \
			Write-Host 'Cancelled to cleanup postgres volume files' -ForegroundColor Yellow; \
		}"

s3-setup:
	@powershell -Command "aws --endpoint-url=http://localhost:4566 s3 mb s3://$(S3_BUCKET_NAME)"
	@echo "Bucket '$(S3_BUCKET_NAME)' created successfully."

s3-cors:
	@powershell -Command "aws --endpoint-url=http://localhost:4566 s3api put-bucket-cors --bucket $(S3_BUCKET_NAME) --cors-configuration file://deploy/s3-cors.json"
	@echo "CORS configured for bucket '$(S3_BUCKET_NAME)'."

s3-ls:
	@powershell -Command "aws --endpoint-url=http://localhost:4566 s3 ls s3://$(S3_BUCKET_NAME) --recursive"

# Монтуємо S3 як фоновий диск S:
# Вкажи повний шлях до rclone, щоб не було проблем з оточенням
s3-mount:
	@echo "Mounting S3 to S: drive (Network Mode)..."
	@cmd /c start /b "" "$(RCLONE_EXE)" mount localstack: S: --vfs-cache-mode full --links --network-mode --volname gyp6.sale --attr-timeout 1s
	@echo "Waiting 5s for drive..."
	@powershell -Command "Start-Sleep -s 5; if (Test-Path S:) { Write-Host 'SUCCESS: S: drive is READY' -ForegroundColor Green } else { Write-Host 'FAILED: Drive not visible. Check if rclone is in PATH.' -ForegroundColor Red }"

# Вбиваємо тільки той rclone, який монтує диск S:
s3-unmount:
	@echo "Stopping rclone and cleaning up Windows Explorer..."
	@powershell -Command "\
		$$proc = Get-CimInstance Win32_Process -Filter \"Name = 'rclone.exe' AND CommandLine LIKE '%mount%S:%'\"; \
		if ($$proc) { Stop-Process -Id $$proc.ProcessId -Force }; \
		net use S: /delete /y 2>$$null; \
		Write-Host 'S: drive completely removed' -ForegroundColor Green;"

# Закинути тестовий файл (наприклад, package.json)
s3-test-upload:
	@powershell -Command "aws --endpoint-url=http://localhost:4566 s3 cp ./package.json s3://$(S3_BUCKET_NAME)/test-file.json"
	@echo "Uploaded package.json to S3 as test-file.json"

fix-explorer:
	@powershell -Command "Stop-Process -Name explorer -Force; Start-Process explorer"

prod-s3-mount:
	@echo "Opening secure SSH tunnel and mounting S3 via PowerShell..."
	@powershell -NoProfile -Command "\
		Write-Host '1. Starting SSH Tunnel...'; \
		$$SshPath = \"$$env:SystemRoot\System32\OpenSSH\ssh.exe\"; \
		if (-not (Test-Path $$SshPath)) { $$SshPath = \"$$env:SystemRoot\Sysnative\OpenSSH\ssh.exe\" }; \
		Start-Process $$SshPath -ArgumentList '-o StrictHostKeyChecking=no -N -L 4566:127.0.0.1:4566 -i C:\Users\Max\.ssh\id_ed25519 root@46.175.148.59' -WindowStyle Hidden; \
		Start-Sleep -s 3; \
		Write-Host '2. Mounting S3 via rclone...'; \
		Start-Process '$(RCLONE_EXE)' -ArgumentList 'mount furniture_s3:furniture-wholesale-bucket P: --vfs-cache-mode full --links --network-mode --volname prod.gyp6.sale --attr-timeout 1s' -WindowStyle Hidden; \
		Start-Sleep -s 5; \
		if (Test-Path P:) { \
			Write-Host 'SUCCESS: Production P: drive is READY!' -ForegroundColor Green; \
		} else { \
			Write-Host 'FAILED: Drive P: not found. Check if tunnel or rclone crashed.' -ForegroundColor Red; \
		}"

prod-s3-unmount:
	@echo "Stopping rclone and closing SSH tunnel..."
	@powershell -NoProfile -Command "\
		$$rclone = Get-CimInstance Win32_Process -Filter \"Name = 'rclone.exe' AND CommandLine LIKE '%mount%P:%'\"; \
		if ($$rclone) { Stop-Process -Id $$rclone.ProcessId -Force }; \
		$$ssh = Get-CimInstance Win32_Process -Filter \"Name = 'ssh.exe' AND CommandLine LIKE '%4566:127.0.0.1:4566%'\"; \
		if ($$ssh) { Stop-Process -Id $$ssh.ProcessId -Force }; \
		net use P: /delete /y 2>$$null; \
		Write-Host 'Production P: drive and tunnel completely removed' -ForegroundColor Green;"
