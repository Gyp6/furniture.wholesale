/**
 * Lab 2 — Performance SLO validation for GET /api/v1/products/price-list
 * (wholesale price list in UAH: PostgreSQL products + NBU exchange rate).
 *
 *   k6 run -e PROFILE=normal perf/price-list.k6.js     # нормальне навантаження  -> PASS
 *   k6 run -e PROFILE=peak   perf/price-list.k6.js     # підвищене навантаження  -> FAIL
 *
 * Env: BASE_URL (default http://localhost:4200), P95_MS, ERROR_RATE (override SLO).
 * Exit code 99 = thresholds crossed (FAIL), 0 = PASS.
 */
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const BASE_URL = __ENV.BASE_URL || 'http://localhost:4200';
const PROFILE = __ENV.PROFILE || 'normal';

// ---- SLO (обґрунтування — у звіті, розділ 2.4) ----
const P95_MS = Number(__ENV.P95_MS || 300); // p95 response time ≤ 300 ms
const ERROR_RATE = Number(__ENV.ERROR_RATE || 0.01); // Error Rate < 1 %

// ---- Модель навантаження ----
const PROFILES = {
  // Звичайний робочий день: ~20 закупівельників одночасно гортають прайс,
  // think time 1 с -> ≈ 18–20 RPS.
  normal: {
    stages: [
      { duration: '15s', target: 20 }, // ramp-up
      { duration: '45s', target: 20 }, // steady state
      { duration: '10s', target: 0 }, // ramp-down
    ],
    thinkTime: 1,
  },
  // Пік (розсилка з акцією / старт сезону): 10× користувачів, think time 0.2 с.
  peak: {
    stages: [
      { duration: '20s', target: 200 },
      { duration: '40s', target: 200 },
      { duration: '10s', target: 0 },
    ],
    thinkTime: 0.2,
  },
};
const profile = PROFILES[PROFILE];
if (!profile) throw new Error(`Unknown PROFILE=${PROFILE}`);

const degraded = new Rate('degraded_responses');

export const options = {
  scenarios: {
    price_list: {
      executor: 'ramping-vus',
      startVUs: 0,
      stages: profile.stages,
      gracefulRampDown: '5s',
    },
  },
  thresholds: {
    'http_req_duration{endpoint:price-list}': [`p(95)<${P95_MS}`],
    'http_req_failed{endpoint:price-list}': [`rate<${ERROR_RATE}`],
    checks: ['rate>0.99'],
  },
  summaryTrendStats: ['avg', 'min', 'med', 'p(90)', 'p(95)', 'p(99)', 'max'],
};

export default function () {
  const res = http.get(`${BASE_URL}/api/v1/products/price-list`, {
    tags: { endpoint: 'price-list' },
    timeout: '10s',
  });

  let body = null;
  try {
    body = res.json();
  } catch (_) {
    body = null;
  }

  check(res, {
    'status is 200': r => r.status === 200,
    'has items': () => !!body && Array.isArray(body.items) && body.items.length > 0,
  });
  degraded.add(!!body && body.degraded === true);

  sleep(profile.thinkTime);
}

function fmt(n) {
  return n === undefined ? '-' : Number(n).toFixed(2);
}

export function handleSummary(data) {
  const d = data.metrics['http_req_duration{endpoint:price-list}'] || data.metrics.http_req_duration;
  const failed = data.metrics['http_req_failed{endpoint:price-list}'] || data.metrics.http_req_failed;
  const reqs = data.metrics.http_reqs;
  const crossed = Object.entries(data.metrics)
    .filter(([, m]) => m.thresholds)
    .flatMap(([name, m]) =>
      Object.entries(m.thresholds).map(([expr, t]) => ({ name, expr, ok: t.ok })),
    );
  const pass = crossed.every(t => t.ok);

  const result = {
    profile: PROFILE,
    status: pass ? 'PASS' : 'FAIL',
    slo: { p95_ms: P95_MS, error_rate: ERROR_RATE },
    requests: reqs.values.count,
    rps: Number(fmt(reqs.values.rate)),
    avg_ms: Number(fmt(d.values.avg)),
    p90_ms: Number(fmt(d.values['p(90)'])),
    p95_ms: Number(fmt(d.values['p(95)'])),
    p99_ms: Number(fmt(d.values['p(99)'])),
    max_ms: Number(fmt(d.values.max)),
    error_rate_pct: Number(fmt((failed ? failed.values.rate : 0) * 100)),
    degraded_pct: Number(fmt((data.metrics.degraded_responses?.values.rate || 0) * 100)),
    vus_max: data.metrics.vus_max?.values.max,
    thresholds: crossed,
  };

  const line = (k, v) => `  ${k.padEnd(22)}${v}\n`;
  let text = `\n==================== price-list SLO report (${PROFILE}) ====================\n`;
  text += line('requests', result.requests);
  text += line('throughput, RPS', result.rps);
  text += line('avg, ms', result.avg_ms);
  text += line('p90, ms', result.p90_ms);
  text += line('p95, ms', `${result.p95_ms}   (SLO < ${P95_MS})`);
  text += line('p99, ms', result.p99_ms);
  text += line('max, ms', result.max_ms);
  text += line('error rate, %', `${result.error_rate_pct}   (SLO < ${ERROR_RATE * 100})`);
  text += line('degraded responses, %', result.degraded_pct);
  text += '  thresholds:\n';
  for (const t of crossed) text += `    ${t.ok ? '✓' : '✗'} ${t.name}: ${t.expr}\n`;
  text += `\n  RESULT: ${result.status}\n`;
  text += '============================================================================\n';

  return {
    stdout: text,
    [`perf/results/${PROFILE}.json`]: JSON.stringify(result, null, 2),
  };
}
