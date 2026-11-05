/**
 * Fake NBU exchange-rate API for load tests, fault injection and resilience tests.
 *
 *   GET  /NBUStatService/v1/statdirectory/exchange?valcode=USD&json  -> NBU-compatible JSON
 *   GET  /__chaos                      -> current fault mode + hit counter
 *   POST /__chaos  {"mode":"ok"|"error"|"delay","delayMs":3000,"status":503}
 *   POST /__chaos/reset                -> mode=ok, hits=0
 *
 * Run standalone:  bun test/fakes/fake-nbu.server.ts   (PORT=4300 by default)
 */
export type TFaultMode = 'ok' | 'error' | 'delay';

export interface IFaultState {
  mode: TFaultMode;
  /** Extra latency for mode=delay (ms). */
  delayMs: number;
  /** HTTP status returned in mode=error. */
  status: number;
  /** Normal network latency of the provider (ms). */
  baseLatencyMs: number;
  /** Rate requests received since the last reset. */
  hits: number;
}

export const EXCHANGE_PATH = '/NBUStatService/v1/statdirectory/exchange';
export const USD_RATE = 41.25;

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

export function startFakeNbu(port = 0, initial: Partial<IFaultState> = {}) {
  const state: IFaultState = {
    mode: 'ok',
    delayMs: 3000,
    status: 503,
    baseLatencyMs: 0,
    hits: 0,
    ...initial,
  };

  const server = Bun.serve({
    port,
    idleTimeout: 120,
    async fetch(req) {
      const url = new URL(req.url);

      if (url.pathname === '/__chaos/reset' && req.method === 'POST') {
        Object.assign(state, { mode: 'ok', hits: 0 });
        return Response.json(state);
      }
      if (url.pathname === '/__chaos') {
        if (req.method === 'POST') {
          const patch = (await req.json().catch(() => ({}))) as Partial<IFaultState>;
          Object.assign(state, patch);
          console.log(`[fake-nbu] fault mode -> ${JSON.stringify(patch)}`);
        }
        return Response.json(state);
      }

      if (url.pathname === EXCHANGE_PATH) {
        state.hits++;
        if (state.baseLatencyMs) await sleep(state.baseLatencyMs);
        if (state.mode === 'error') {
          return new Response('Service Unavailable', { status: state.status });
        }
        if (state.mode === 'delay') await sleep(state.delayMs);
        const cc = url.searchParams.get('valcode') ?? 'USD';
        return Response.json([
          {
            r030: 840,
            txt: 'Долар США',
            rate: USD_RATE,
            cc,
            exchangedate: '22.10.2026',
          },
        ]);
      }
      return new Response('Not found', { status: 404 });
    },
  });

  return {
    state,
    url: `http://localhost:${server.port}${EXCHANGE_PATH}`,
    port: server.port,
    setFault(patch: Partial<IFaultState>) {
      Object.assign(state, patch);
    },
    reset() {
      Object.assign(state, { mode: 'ok' as TFaultMode, hits: 0 });
    },
    stop: () => server.stop(true),
  };
}

// started directly: `bun test/fakes/fake-nbu.server.ts`
if (process.argv[1]?.includes('fake-nbu.server')) {
  const port = Number(process.env.PORT ?? 4300);
  const fake = startFakeNbu(port, {
    baseLatencyMs: Number(process.env.BASE_LATENCY_MS ?? 20),
  });
  console.log(`[fake-nbu] listening on :${fake.port}  (rates: ${fake.url})`);
}
