import { Logger } from '@nestjs/common';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  mock,
  spyOn,
} from 'bun:test';

import {
  ExchangeRateClient,
  FxResponseError,
  FxUnavailableError,
} from './exchange-rate.client';
import { DEFAULT_FX_OPTIONS, type IFxOptions } from './fx.config';
import type { TFetch } from './fx.types';

const NBU_BODY = [
  {
    r030: 840,
    txt: 'Долар США',
    rate: 41.25,
    cc: 'USD',
    exchangedate: '22.10.2026',
  },
];

const ok = () => ({ ok: true, status: 200, json: async () => NBU_BODY });
const fail = (status: number) => ({
  ok: false,
  status,
  json: async () => ({}),
});
/** Never answers — only the AbortSignal (timeout) can finish the call. */
const hang: TFetch = (_url, init) =>
  new Promise((_, reject) =>
    init?.signal?.addEventListener('abort', () =>
      reject(
        init.signal?.reason ?? new DOMException('timeout', 'TimeoutError'),
      ),
    ),
  );

const options = (patch: Partial<IFxOptions> = {}): IFxOptions => ({
  ...DEFAULT_FX_OPTIONS,
  baseUrl: 'http://fx.test/exchange',
  baseDelayMs: 1, // backoff itself is covered by retry.spec.ts
  maxDelayMs: 1,
  ...patch,
});

describe('ExchangeRateClient (stubbed NBU)', () => {
  let warn: ReturnType<typeof spyOn>;
  let error: ReturnType<typeof spyOn>;

  beforeEach(() => {
    warn = spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
    error = spyOn(Logger.prototype, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    warn.mockRestore();
    error.mockRestore();
  });

  it('positive: returns the live rate with ONE call, no retry, no fallback', async () => {
    const fetchFn = mock(async (_url: string) => ok());
    const client = new ExchangeRateClient(
      options(),
      fetchFn as unknown as TFetch,
    );

    const result = await client.getRate('USD');

    expect(result).toEqual({
      rate: 41.25,
      currency: 'USD',
      date: '22.10.2026',
      source: 'live',
      attempts: 1,
    });
    expect(fetchFn).toHaveBeenCalledTimes(1);
    expect(fetchFn.mock.calls[0][0]).toBe(
      'http://fx.test/exchange?valcode=USD&json',
    );
    expect(warn).not.toHaveBeenCalled();
  });

  it('HTTP 503: exactly maxAttempts=3 calls, then FxUnavailableError + diagnostic logs', async () => {
    const fetchFn = mock(async () => fail(503));
    const client = new ExchangeRateClient(
      options(),
      fetchFn as unknown as TFetch,
    );

    const err = await client.getRate('USD').catch(e => e);

    expect(err).toBeInstanceOf(FxUnavailableError);
    expect(err.attempts).toBe(3);
    expect(fetchFn).toHaveBeenCalledTimes(3);
    expect(warn).toHaveBeenCalledTimes(2); // "attempt 1/3 failed ... retry in"
    expect(String(error.mock.calls[0][0])).toContain('fallback=base-currency');
  });

  it('recovers when the provider answers on the 3rd attempt', async () => {
    let n = 0;
    const fetchFn = mock(async () => (++n < 3 ? fail(502) : ok()));
    const client = new ExchangeRateClient(
      options(),
      fetchFn as unknown as TFetch,
    );

    const result = await client.getRate('USD');

    expect(result).toMatchObject({ rate: 41.25, source: 'live', attempts: 3 });
  });

  it('does not retry client errors (HTTP 404)', async () => {
    const fetchFn = mock(async () => fail(404));
    const client = new ExchangeRateClient(
      options(),
      fetchFn as unknown as TFetch,
    );

    await expect(client.getRate('USD')).rejects.toMatchObject({ attempts: 1 });
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });

  it('timeout: every attempt is cut after timeoutMs, the call is bounded in time', async () => {
    const fetchFn = mock(hang);
    const client = new ExchangeRateClient(options({ timeoutMs: 30 }), fetchFn);

    const started = performance.now();
    const err = await client.getRate('USD').catch(e => e);
    const elapsed = performance.now() - started;

    expect(err).toBeInstanceOf(FxUnavailableError);
    expect(err.reason).toBe('timeout after 30 ms');
    expect(fetchFn).toHaveBeenCalledTimes(3);
    expect(elapsed).toBeLessThan(1000); // 3 × 30 ms + backoff, never "hangs"
  });

  it('fallback: returns the last known good rate marked as stale-cache', async () => {
    let up = true;
    const fetchFn = mock(async () => (up ? ok() : fail(503)));
    const client = new ExchangeRateClient(
      options(),
      fetchFn as unknown as TFetch,
    );

    await client.getRate('USD'); // warms the cache
    up = false;
    const result = await client.getRate('USD');

    expect(result).toMatchObject({
      rate: 41.25,
      source: 'stale-cache',
      attempts: 3,
    });
    expect(String(error.mock.calls[0][0])).toContain('fallback=stale-cache');
  });

  it('kill-switch off (original behaviour): one call, raw error propagates', async () => {
    const fetchFn = mock(async () => fail(503));
    const client = new ExchangeRateClient(
      options({ resilienceEnabled: false }),
      fetchFn as unknown as TFetch,
    );

    await expect(client.getRate('USD')).rejects.toBeInstanceOf(FxResponseError);
    expect(fetchFn).toHaveBeenCalledTimes(1);
  });
});
