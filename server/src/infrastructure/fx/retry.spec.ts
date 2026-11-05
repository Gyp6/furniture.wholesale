import { describe, expect, it, mock } from 'bun:test';

import { backoffDelay, RetryExhaustedError, withRetry } from './retry';

const noSleep = mock((_ms: number) => Promise.resolve());

describe('backoffDelay (exponential backoff + full jitter)', () => {
  it('grows exponentially and is capped by maxDelayMs', () => {
    const max = () => 1; // worst case of the jitter
    expect([1, 2, 3, 4, 5].map(a => backoffDelay(a, 100, 1000, max))).toEqual([
      100, 200, 400, 800, 1000,
    ]);
  });

  it('never exceeds the exponential ceiling (jitter in [0, ceiling])', () => {
    for (let i = 0; i < 100; i++) {
      const d = backoffDelay(3, 100, 1000);
      expect(d).toBeGreaterThanOrEqual(0);
      expect(d).toBeLessThanOrEqual(400);
    }
  });
});

describe('withRetry', () => {
  it('stops after maxAttempts and waits with backoff between attempts', async () => {
    noSleep.mockClear();
    const op = mock(() => Promise.reject(new Error('503')));

    const run = withRetry(op, {
      maxAttempts: 3,
      baseDelayMs: 100,
      maxDelayMs: 1000,
      isRetryable: () => true,
      sleep: noSleep,
      random: () => 1,
    });

    await expect(run).rejects.toBeInstanceOf(RetryExhaustedError);
    expect(op).toHaveBeenCalledTimes(3); // bounded: no retry storm
    expect(noSleep.mock.calls.map(c => c[0])).toEqual([100, 200]); // backoff
  });

  it('does not retry non-transient errors', async () => {
    const op = mock(() => Promise.reject(new Error('400')));
    await expect(
      withRetry(op, {
        maxAttempts: 3,
        baseDelayMs: 100,
        maxDelayMs: 1000,
        isRetryable: () => false,
        sleep: noSleep,
      }),
    ).rejects.toMatchObject({ attempts: 1 });
    expect(op).toHaveBeenCalledTimes(1);
  });

  it('returns the first successful result', async () => {
    let n = 0;
    const result = await withRetry(
      async () => {
        if (++n < 2) throw new Error('blip');
        return 'ok';
      },
      {
        maxAttempts: 3,
        baseDelayMs: 1,
        maxDelayMs: 1,
        isRetryable: () => true,
        sleep: noSleep,
      },
    );
    expect(result).toBe('ok');
    expect(n).toBe(2);
  });
});
