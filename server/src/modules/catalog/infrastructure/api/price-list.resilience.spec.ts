/**
 * Integration resilience test (Lab 2, task 3):
 * real NestJS controller + PriceListService + ExchangeRateClient over real HTTP
 * against a fake NBU server (test double) with deterministic fault injection.
 * The product repository (PostgreSQL) is stubbed; the real NBU is never called.
 */
import {
  PriceListService,
  ProductService,
} from '@catalog/application/services';
import { PRODUCT_REPOSITORY } from '@catalog/domain/contracts';
import { Logger } from '@nestjs/common';
import {
  FastifyAdapter,
  type NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import {
  afterAll,
  afterEach,
  beforeAll,
  describe,
  expect,
  it,
  spyOn,
} from 'bun:test';

import {
  DEFAULT_FX_OPTIONS,
  ExchangeRateClient,
  FX_FETCH,
  FX_OPTIONS,
} from '@/infrastructure/fx';
import { S3Service } from '@/infrastructure/s3/s3.service';

import {
  startFakeNbu,
  USD_RATE,
} from '../../../../../test/fakes/fake-nbu.server';

import { ProductController } from './product.controller';

const PRODUCTS = [
  { id: 'p1', sku: 'GYP6-0001', title: 'Nordic Chair', price: 120 },
  { id: 'p2', sku: 'GYP6-0002', title: 'Oak Table', price: 450.5 },
];

describe('GET /products/price-list — fault injection on the NBU dependency', () => {
  const nbu = startFakeNbu(0);
  let app: NestFastifyApplication;
  let fxErrors: ReturnType<typeof spyOn>;

  const fxOptions = {
    ...DEFAULT_FX_OPTIONS,
    baseUrl: nbu.url,
    timeoutMs: 100,
    maxAttempts: 3,
    baseDelayMs: 5,
    maxDelayMs: 20,
  };

  /** New app per scenario -> clean last-known-rate cache (deterministic). */
  async function boot() {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        PriceListService,
        ExchangeRateClient,
        { provide: FX_OPTIONS, useValue: fxOptions },
        {
          provide: FX_FETCH,
          useValue: (u: string, i?: RequestInit) => fetch(u, i),
        },
        {
          provide: PRODUCT_REPOSITORY,
          useValue: { findAll: async () => PRODUCTS },
        },
        { provide: ProductService, useValue: {} },
        { provide: S3Service, useValue: {} },
      ],
    }).compile();
    app = moduleRef.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
      {
        logger: false,
      },
    );
    await app.init();
    await app.getHttpAdapter().getInstance().ready();
  }

  const get = () =>
    app
      .getHttpAdapter()
      .getInstance()
      .inject({ method: 'GET', url: '/products/price-list' });

  beforeAll(() => {
    spyOn(Logger.prototype, 'warn').mockImplementation(() => {});
  });

  afterEach(async () => {
    fxErrors?.mockRestore();
    nbu.reset();
    await app?.close();
  });

  afterAll(() => nbu.stop());

  it('positive: NBU is healthy -> 200, prices in UAH, fallback NOT used, 1 call', async () => {
    await boot();
    const res = await get();
    const body = res.json();

    expect(res.statusCode).toBe(200);
    expect(res.headers['x-degraded']).toBeUndefined();
    expect(body).toMatchObject({
      currency: 'UAH',
      rate: USD_RATE,
      rateSource: 'live',
      degraded: false,
      fxAttempts: 1,
    });
    expect(body.items[1]).toEqual({
      id: 'p2',
      sku: 'GYP6-0002',
      title: 'Oak Table',
      priceUsd: 450.5,
      price: 18583.13, // 450.5 * 41.25
    });
    expect(nbu.state.hits).toBe(1);
  });

  it('HTTP 503: 3 attempts, then graceful degradation (200 + USD prices + X-Degraded)', async () => {
    await boot();
    fxErrors = spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    nbu.setFault({ mode: 'error', status: 503 });

    const res = await get();
    const body = res.json();

    expect(res.statusCode).toBe(200); // not 500
    expect(res.headers['x-degraded']).toBe('fx');
    expect(res.headers['x-fx-attempts']).toBe('3');
    expect(body).toMatchObject({
      currency: 'USD',
      rate: null,
      rateSource: 'unavailable',
      degraded: true,
      fxAttempts: 3,
    });
    expect(body.items.map((i: { price: number }) => i.price)).toEqual([
      120, 450.5,
    ]);
    expect(nbu.state.hits).toBe(3); // bounded retry, no storm
    expect(String(fxErrors.mock.calls[0][0])).toContain(
      'FX USD unavailable after 3 attempt(s): Exchange-rate provider responded with HTTP 503',
    );
  });

  it('timeout: NBU hangs for 2 s -> answer in < 1 s with fallback, never hangs', async () => {
    await boot();
    fxErrors = spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    nbu.setFault({ mode: 'delay', delayMs: 2000 });

    const started = performance.now();
    const res = await get();
    const elapsed = performance.now() - started;

    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({ degraded: true, fxAttempts: 3 });
    expect(elapsed).toBeLessThan(1000); // 3 × 100 ms timeout + ≤ 25 ms backoff
    expect(String(fxErrors.mock.calls[0][0])).toContain('timeout after 100 ms');
  });

  it('stale-cache: after a good answer, an outage serves the last known UAH rate', async () => {
    await boot();
    fxErrors = spyOn(Logger.prototype, 'error').mockImplementation(() => {});
    await get(); // warm-up: live rate cached
    nbu.setFault({ mode: 'error', status: 500 });

    const res = await get();

    expect(res.statusCode).toBe(200);
    expect(res.headers['x-fx-source']).toBe('stale-cache');
    expect(res.json()).toMatchObject({
      currency: 'UAH',
      rate: USD_RATE,
      rateSource: 'stale-cache',
      degraded: true,
    });
  });
});
