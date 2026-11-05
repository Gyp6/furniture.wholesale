#!/usr/bin/env node
/**
 * Lab 5 — measurement guard: source files must be UTF-8 (no BOM, no UTF-16) with LF endings.
 * Experiment 1 showed that Lizard silently reports 0 functions for a UTF-16 file
 * ("No thresholds exceeded", exit 0) — a false PASS. This check runs before any metric.
 *   node tools/metrics/check-encoding.mjs            # all tracked .ts/.tsx/.js
 *   node tools/metrics/check-encoding.mjs a.ts b.ts  # given files
 */
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const files = process.argv.length > 2 ? process.argv.slice(2) : execSync('git ls-files -- "*.ts" "*.tsx" "*.js" "*.mjs"', { encoding: 'utf8' })
  .split('\n')
  .filter(Boolean);
const decoder = new TextDecoder('utf-8', { fatal: true });
const problems = [];

for (const f of files) {
  const buf = readFileSync(f);
  if (buf[0] === 0xff && buf[1] === 0xfe) problems.push([f, 'UTF-16 LE']);
  else if (buf[0] === 0xfe && buf[1] === 0xff) problems.push([f, 'UTF-16 BE']);
  else {
    if (buf[0] === 0xef && buf[1] === 0xbb && buf[2] === 0xbf) problems.push([f, 'UTF-8 BOM']);
    try {
      decoder.decode(buf);
    } catch {
      problems.push([f, 'invalid UTF-8']);
    }
    if (buf.includes(0x0d)) problems.push([f, 'CRLF line endings']);
  }
}

if (problems.length) {
  for (const [f, why] of problems) console.error(`✗ ${f}: ${why}`);
  console.error(`\n${problems.length} file(s) are not normalized (UTF-16 breaks analyzers; BOM/CRLF break comparability). Fix: git add --renormalize .`);
  process.exit(1);
}
console.log(`✓ ${files.length} files: UTF-8, no BOM, LF`);
