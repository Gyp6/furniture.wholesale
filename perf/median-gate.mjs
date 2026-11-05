#!/usr/bin/env node
/**
 * Lab 5 — stable performance gate.
 * One k6 run is one sample; infrastructure noise (CPU steal, a noisy neighbour,
 * a throttled container) can push a single p95 over the SLO although the code is the same.
 * The gate runs k6 N times (default 3) and decides by the MEDIAN p95 / error rate.
 *
 *   node perf/median-gate.mjs normal 3          # needs k6 in PATH (or K6_CMD)
 */
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const profile = process.argv[2] ?? 'normal';
const runs = Number(process.argv[3] ?? 3);
const p95Slo = Number(process.env.P95_MS ?? 300);
const errSlo = Number(process.env.ERROR_RATE ?? 0.01) * 100;
const k6 = (process.env.K6_CMD ?? 'k6').split(' ');
const script = process.env.K6_SCRIPT ?? 'perf/price-list.k6.js'; // /perf/price-list.k6.js for the k6 container

const median = xs => {
  const s = [...xs].sort((a, b) => a - b);
  const m = s.length >> 1;
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

const samples = [];
for (let i = 1; i <= runs; i++) {
  try {
    execFileSync(k6[0], [...k6.slice(1), 'run', '-q', '-e', `PROFILE=${profile}`, script], {
      stdio: ['ignore', 'ignore', 'inherit'],
      env: { ...process.env, K6_NO_USAGE_REPORT: 'true' },
    });
  } catch {
    /* a single crossed threshold is not a verdict here */
  }
  const r = JSON.parse(readFileSync(`perf/results/${profile}.json`, 'utf8'));
  samples.push(r);
  console.log(`run ${i}/${runs}: p95=${r.p95_ms} ms, errors=${r.error_rate_pct} %, single-run status=${r.status}`);
}

const p95 = median(samples.map(s => s.p95_ms));
const err = median(samples.map(s => s.error_rate_pct));
const spread = Math.max(...samples.map(s => s.p95_ms)) - Math.min(...samples.map(s => s.p95_ms));
const pass = p95 < p95Slo && err < errSlo;
console.log(`\nmedian p95 = ${p95} ms (SLO < ${p95Slo}), median errors = ${err} % (SLO < ${errSlo})`);
console.log(`p95 spread between runs = ${spread.toFixed(2)} ms ${spread > p95Slo * 0.2 ? '⚠ unstable environment' : ''}`);
console.log(`STABLE GATE: ${pass ? 'PASS' : 'FAIL'}`);
process.exit(pass ? 0 : 1);
