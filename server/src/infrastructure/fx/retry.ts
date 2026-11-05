export interface IRetryOptions {
  /** Total attempts including the first call. */
  maxAttempts: number;
  baseDelayMs: number;
  maxDelayMs: number;
  /** Decides whether the error is transient (timeout, network, 5xx, 429). */
  isRetryable: (error: unknown) => boolean;
  /** Called before waiting for the next attempt (logging / metrics). */
  onRetry?: (info: {
    attempt: number;
    delayMs: number;
    error: unknown;
  }) => void;
  /** Injected for deterministic tests. */
  sleep?: (ms: number) => Promise<void>;
  random?: () => number;
}

export class RetryExhaustedError extends Error {
  constructor(
    public readonly attempts: number,
    public readonly lastError: unknown,
  ) {
    super(
      `Gave up after ${attempts} attempt(s): ${
        lastError instanceof Error ? lastError.message : String(lastError)
      }`,
    );
    this.name = 'RetryExhaustedError';
  }
}

const defaultSleep = (ms: number) =>
  new Promise<void>(resolve => setTimeout(resolve, ms));

/**
 * Exponential backoff with "full jitter" (AWS Architecture Blog):
 * delay = random(0, min(maxDelay, base * 2^(attempt-1))).
 * Jitter de-synchronises concurrent clients, so they do not hit the
 * recovering dependency at the same moment (thundering herd / retry storm).
 */
export function backoffDelay(
  attempt: number,
  baseDelayMs: number,
  maxDelayMs: number,
  random: () => number = Math.random,
): number {
  const ceiling = Math.min(maxDelayMs, baseDelayMs * 2 ** (attempt - 1));
  return Math.round(random() * ceiling);
}

export async function withRetry<T>(
  operation: (attempt: number) => Promise<T>,
  options: IRetryOptions,
): Promise<T> {
  const sleep = options.sleep ?? defaultSleep;
  const random = options.random ?? Math.random;
  let lastError: unknown;

  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    try {
      return await operation(attempt);
    } catch (error) {
      lastError = error;
      const isLast = attempt === options.maxAttempts;
      if (isLast || !options.isRetryable(error)) {
        throw new RetryExhaustedError(attempt, error);
      }
      const delayMs = backoffDelay(
        attempt,
        options.baseDelayMs,
        options.maxDelayMs,
        random,
      );
      options.onRetry?.({ attempt, delayMs, error });
      await sleep(delayMs);
    }
  }
  throw new RetryExhaustedError(options.maxAttempts, lastError);
}
