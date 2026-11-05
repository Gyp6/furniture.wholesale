import { ConfigService } from '@nestjs/config';

import { NBU_EXCHANGE_URL } from './fx.constants';

export interface IFxOptions {
  /** Base URL of the NBU exchange endpoint (points to the fake server in tests / fault injection). */
  baseUrl: string;
  /** Kill-switch: `false` restores the original naive call (used to reproduce the "before" behaviour). */
  resilienceEnabled: boolean;
  /** Timeout of ONE HTTP attempt. */
  timeoutMs: number;
  /** Total number of attempts, including the first one (1 = no retry). */
  maxAttempts: number;
  /** Base delay for exponential backoff: base * 2^(attempt-1), with full jitter. */
  baseDelayMs: number;
  /** Upper bound for a single backoff delay. */
  maxDelayMs: number;
}

/**
 * Defaults are justified in docs/lab2 (report):
 *  - NBU answers in ~100–250 ms, so 500 ms per attempt is ≈ 2× its p99 and keeps
 *    the whole price-list request inside the 800 ms SLO budget for the happy path;
 *  - 3 attempts (1 + 2 retries) cover short network blips, more attempts only add
 *    load to an already failing dependency (retry storm);
 *  - 100 ms → 200 ms exponential backoff with full jitter spreads retries of
 *    concurrent requests in time; worst case ≈ 3 × 500 + 300 = 1.8 s.
 */
export const DEFAULT_FX_OPTIONS: IFxOptions = {
  baseUrl: NBU_EXCHANGE_URL,
  resilienceEnabled: true,
  timeoutMs: 500,
  maxAttempts: 3,
  baseDelayMs: 100,
  maxDelayMs: 1000,
};

const toInt = (value: string | undefined, fallback: number) => {
  const n = Number(value);
  return Number.isFinite(n) && n >= 0 ? n : fallback;
};

export function fxOptionsFromConfig(config: ConfigService): IFxOptions {
  const d = DEFAULT_FX_OPTIONS;
  return {
    baseUrl: config.get<string>('FX_API_URL') || d.baseUrl,
    resilienceEnabled: config.get<string>('FX_RESILIENCE_ENABLED') !== 'false',
    timeoutMs: toInt(config.get('FX_TIMEOUT_MS'), d.timeoutMs),
    maxAttempts: Math.max(
      1,
      toInt(config.get('FX_MAX_ATTEMPTS'), d.maxAttempts),
    ),
    baseDelayMs: toInt(config.get('FX_RETRY_BASE_MS'), d.baseDelayMs),
    maxDelayMs: toInt(config.get('FX_RETRY_MAX_MS'), d.maxDelayMs),
  };
}
