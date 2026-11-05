# Lab 2 — Performance Efficiency & Reliability (ISO/IEC 25010)

Endpoint under test: `GET /api/v1/products/price-list` — wholesale price list in UAH
(products from PostgreSQL × USD rate from the NBU HTTP API).

```powershell
docker compose -f deploy/lab2/docker-compose.yaml up -d --build     # stand
docker compose -f deploy/lab2/docker-compose.yaml run --rm k6 run -e PROFILE=normal /perf/price-list.k6.js  # PASS
docker compose -f deploy/lab2/docker-compose.yaml run --rm k6 run -e PROFILE=peak   /perf/price-list.k6.js  # FAIL
```

## Fault injection (fake NBU, port 4300)

```powershell
curl.exe -X POST localhost:4300/__chaos -d '{\"mode\":\"error\",\"status\":503}'   # HTTP 5xx
curl.exe -X POST localhost:4300/__chaos -d '{\"mode\":\"delay\",\"delayMs\":8000}' # timeout
curl.exe -X POST localhost:4300/__chaos/reset                                       # healthy
curl.exe -i localhost:4200/api/v1/products/price-list
```

"Before" (no timeout/retry/fallback): `$env:FX_RESILIENCE_ENABLED="false"; docker compose -f deploy/lab2/docker-compose.yaml up -d api`

## Resilience tests

```powershell
cd server; bun run test:resilience     # or: bun run test (whole suite)
```
