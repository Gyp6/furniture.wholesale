import { Inject, Injectable, Logger } from '@nestjs/common';

import { type IFxOptions } from './fx.config';
import { FX_FETCH, FX_OPTIONS } from './fx.constants';
import type { IExchangeRate, INbuRateDto, TFetch } from './fx.types';
import { RetryExhaustedError, withRetry } from './retry';

export class FxResponseError extends Error {
  constructor(public readonly status: number) {
    super(`Exchange-rate provider responded with HTTP ${status}`);
    this.name = 'FxResponseError';
  }
}

/** Thrown when the provider failed and there is no last-known rate to fall back to. */
export class FxUnavailableError extends Error {
  constructor(
    public readonly attempts: number,
    public readonly reason: string,
  ) {
    super(`Exchange rate unavailable after ${attempts} attempt(s): ${reason}`);
    this.name = 'FxUnavailableError';
  }
}

export interface IFxResult extends IExchangeRate {
  /** live = fresh answer, stale-cache = last known good rate (fallback). */
  source: 'live' | 'stale-cache';
  /** HTTP attempts spent on this call (1 = no retries). */
  attempts: number;
}

export function parseNbuRate(body: unknown, currency: string): IExchangeRate {
  const item = Array.isArray(body)
    ? (body as INbuRateDto[]).find(r => r.cc === currency)
    : undefined;
  if (!item || !(item.rate > 0)) {
    throw new Error(`Exchange-rate provider returned no rate for ${currency}`);
  }
  return { rate: item.rate, currency: item.cc, date: item.exchangedate };
}

const errorName = (e: unknown) => (e instanceof Error ? e.name : '');

/** Transient failures worth retrying: timeout, network error, HTTP 5xx / 429. */
export function isTransientFxError(error: unknown): boolean {
  if (error instanceof FxResponseError) {
    return error.status >= 500 || error.status === 429;
  }
  return ['TimeoutError', 'AbortError', 'TypeError'].includes(errorName(error));
}

function describe(error: unknown, timeoutMs: number): string {
  if (['TimeoutError', 'AbortError'].includes(errorName(error))) {
    return `timeout after ${timeoutMs} ms`;
  }
  return error instanceof Error ? error.message : String(error);
}

/**
 * HTTP client of the National Bank of Ukraine exchange-rate API (external dependency).
 *
 * Resilience (Lab 2):
 *  - timeout per attempt (AbortSignal) — a slow NBU can no longer hold the request;
 *  - bounded retry: maxAttempts, exponential backoff + full jitter, only transient errors;
 *  - fallback: last known good rate (NBU publishes the official rate once a day,
 *    so a slightly stale rate is an acceptable degraded answer).
 */
@Injectable()
export class ExchangeRateClient {
  private readonly logger = new Logger(ExchangeRateClient.name);
  private readonly lastKnown = new Map<string, IExchangeRate>();

  constructor(
    @Inject(FX_OPTIONS) private readonly options: IFxOptions,
    @Inject(FX_FETCH) private readonly fetchFn: TFetch,
  ) {}

  async getRate(currency = 'USD'): Promise<IFxResult> {
    if (!this.options.resilienceEnabled) {
      // Original behaviour, kept behind the kill-switch to reproduce the "before" state.
      return {
        ...(await this.fetchOnce(currency)),
        source: 'live',
        attempts: 1,
      };
    }

    let attempts = 0;
    try {
      const rate = await withRetry(
        attempt => {
          attempts = attempt;
          return this.fetchOnce(currency, this.options.timeoutMs);
        },
        {
          maxAttempts: this.options.maxAttempts,
          baseDelayMs: this.options.baseDelayMs,
          maxDelayMs: this.options.maxDelayMs,
          isRetryable: isTransientFxError,
          onRetry: ({ attempt, delayMs, error }) =>
            this.logger.warn(
              `FX ${currency} attempt ${attempt}/${this.options.maxAttempts} failed: ` +
                `${describe(error, this.options.timeoutMs)}; retry in ${delayMs} ms`,
            ),
        },
      );
      this.lastKnown.set(currency, rate);
      return { ...rate, source: 'live', attempts };
    } catch (error) {
      const cause =
        error instanceof RetryExhaustedError ? error.lastError : error;
      const reason = describe(cause, this.options.timeoutMs);
      const cached = this.lastKnown.get(currency);
      this.logger.error(
        `FX ${currency} unavailable after ${attempts} attempt(s): ${reason} -> ` +
          (cached
            ? `fallback=stale-cache (rate ${cached.rate} of ${cached.date})`
            : 'fallback=base-currency (no cached rate)'),
      );
      if (cached) return { ...cached, source: 'stale-cache', attempts };
      throw new FxUnavailableError(attempts, reason);
    }
  }

  private async fetchOnce(
    currency: string,
    timeoutMs?: number,
  ): Promise<IExchangeRate> {
    const url = `${this.options.baseUrl}?valcode=${currency}&json`;
    // Own AbortController + setTimeout instead of AbortSignal.timeout():
    // Bun on Windows does not always fire AbortSignal.timeout, so a hung
    // provider would hang the request (seen in lab 5 test runs).
    const controller = new AbortController();
    const timer = timeoutMs
      ? setTimeout(
          () => controller.abort(new DOMException('timeout', 'TimeoutError')),
          timeoutMs,
        )
      : undefined;
    try {
      const response = await this.fetchFn(
        url,
        timeoutMs ? { signal: controller.signal } : undefined,
      );
      if (!response.ok) throw new FxResponseError(response.status);
      return parseNbuRate(await response.json(), currency);
    } finally {
      clearTimeout(timer);
    }
  }
}
