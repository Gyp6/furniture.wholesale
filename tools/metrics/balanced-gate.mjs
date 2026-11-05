#!/usr/bin/env node
/**
 * Lab 5 — Balanced Quality Gate (coverage can not be "farmed" without killing mutants).
 *
 *   PASS  <=>  (Line Coverage >= COVERAGE_MIN)  AND  (Mutation Score >= MUTATION_MIN)
 *
 * Inputs (server/):
 *   coverage/lcov.info                  <- bun test --coverage --coverage-reporter=lcov
 *   reports/mutation/mutation.json      <- npx stryker run   (mutation-testing-report-schema)
 * Scope: the files Stryker mutates (same code for both metrics).
 */
import { readFileSync } from 'node:fs';
import { relative, resolve } from 'node:path';

const COVERAGE_MIN = Number(process.env.COVERAGE_MIN ?? 80);
const MUTATION_MIN = Number(process.env.MUTATION_MIN ?? 65);
const dir = resolve(process.argv[2] ?? 'server');

const mutationFile = process.env.MUTATION_JSON ?? `${dir}/reports/mutation/mutation.json`;
const lcovFile = process.env.LCOV ?? `${dir}/coverage/lcov.info`;
const mutation = JSON.parse(readFileSync(mutationFile, 'utf8'));
const scope = new Set(Object.keys(mutation.files).map(f => relative(dir, resolve(dir, f))));

let killed = 0, valid = 0;
for (const file of Object.values(mutation.files)) {
  for (const m of file.mutants) {
    if (['CompileError', 'RuntimeError', 'Ignored'].includes(m.status)) continue;
    valid++;
    if (['Killed', 'Timeout'].includes(m.status)) killed++;
  }
}
const mutationScore = valid ? (100 * killed) / valid : 0;

let lf = 0, lh = 0, current = null;
for (const line of readFileSync(lcovFile, 'utf8').split('\n')) {
  if (line.startsWith('SF:')) current = relative(dir, resolve(dir, line.slice(3)));
  else if (current && scope.has(current) && line.startsWith('LF:')) lf += Number(line.slice(3));
  else if (current && scope.has(current) && line.startsWith('LH:')) lh += Number(line.slice(3));
}
const coverage = lf ? (100 * lh) / lf : 0;

const okCov = coverage >= COVERAGE_MIN;
const okMut = mutationScore >= MUTATION_MIN;
console.log(`scope: ${scope.size} files`);
console.log(`${okCov ? '✓' : '✗'} Line Coverage   ${coverage.toFixed(1)} %  (>= ${COVERAGE_MIN})`);
console.log(`${okMut ? '✓' : '✗'} Mutation Score  ${mutationScore.toFixed(1)} %  (>= ${MUTATION_MIN})  killed ${killed}/${valid}`);
console.log(`BALANCED GATE: ${okCov && okMut ? 'PASS' : 'FAIL'}`);
process.exit(okCov && okMut ? 0 : 1);
