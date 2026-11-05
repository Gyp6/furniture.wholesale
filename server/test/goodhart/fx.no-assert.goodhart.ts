/**
 * Lab 5 — Goodhart's law demo. DO NOT USE AS A REAL TEST.
 *
 * "Coverage-farming" suite: it executes every branch of the FX resilience code
 * (so Line Coverage looks great) but asserts NOTHING. It is excluded from
 * `bun test` (no .spec/.test suffix) and is run only by the lab5 experiment:
 *   bun test --coverage ./test/goodhart/fx.no-assert.goodhart.ts
 */
import { test } from 'bun:test';

import { ExchangeRateClient } from '@/infrastructure/fx/exchange-rate.client';
import { DEFAULT_FX_OPTIONS } from '@/infrastructure/fx/fx.config';
import type { TFetch } from '@/infrastructure/fx/fx.types';
import { backoffDelay, withRetry } from '@/infrastructure/fx/retry';
import { PriceListService } from '@/modules/catalog/application/services/price-list.service';

const body = [{ r030: 840, txt: 'USD', rate: 41.25, cc: 'USD', exchangedate: '22.10.2026' }];
const ok: TFetch = async () => ({ ok: true, status: 200, json: async () => body });
const err = (s: number): TFetch => async () => ({ ok: false, status: s, json: async () => ({}) });
const hang: TFetch = (_u, i) =>
  new Promise((_, rej) => i?.signal?.addEventListener('abort', () => rej(i.signal?.reason)));
const opts = { ...DEFAULT_FX_OPTIONS, baseDelayMs: 1, maxDelayMs: 1, timeoutMs: 20 };
const repo = { findAll: async () => [{ id: '1', sku: 's', title: 't', price: 10 }] } as never;

test('touch everything, check nothing', async () => {
  backoffDelay(3, 100, 1000);
  await withRetry(async () => 1, { maxAttempts: 1, baseDelayMs: 1, maxDelayMs: 1, isRetryable: () => true }).catch(() => {});
  for (const f of [ok, err(503), err(404), hang]) {
    const c = new ExchangeRateClient(opts, f);
    await c.getRate('USD').catch(() => {});
    await c.getRate('USD').catch(() => {});
    await new PriceListService(repo, c).getPriceList().catch(() => {});
  }
  const warm = new ExchangeRateClient(opts, ok);
  await warm.getRate('USD');
  (warm as unknown as { fetchFn: TFetch }).fetchFn = err(500);
  await warm.getRate('USD').catch(() => {});
  await new PriceListService(repo, new ExchangeRateClient({ ...opts, resilienceEnabled: false }, err(503))).getPriceList().catch(() => {});
  // no expect() at all — the CI "coverage" gate is still green
});
