// Lab 7 — data-mutation guard for PriceListService.getPriceList (Chepin audit).
// Green on the baseline, RED on `feat(audit): simulate data mutation issue, FAIL`,
// green again after the immutable Value Object refactoring.
import { describe, expect, it } from 'bun:test';

import { FxUnavailableError, type IFxResult } from '@/infrastructure/fx';

import { PriceListService } from './price-list.service';

const RATE = 41.25;
const round2 = (n: number) => Math.round(n * 100) / 100;

// The repository may return CACHED entity instances: the same objects on every call.
const PRODUCTS = Object.freeze([
  Object.freeze({
    id: 'p1',
    sku: 'GYP6-0001',
    title: 'Nordic Chair',
    price: 120,
  }),
  Object.freeze({
    id: 'p2',
    sku: 'GYP6-0002',
    title: 'Oak Table',
    price: 450.5,
  }),
  Object.freeze({
    id: 'p3',
    sku: 'GYP6-0003',
    title: 'Bar Stool',
    price: 75.99,
  }),
]);

const live: IFxResult = {
  currency: 'USD',
  rate: RATE,
  date: '05.11.2026',
  source: 'live',
  attempts: 1,
};

const service = (getRate: () => Promise<IFxResult>) =>
  new PriceListService(
    { findAll: () => Promise.resolve(PRODUCTS) } as any,
    { getRate } as any,
  );

describe('PriceListService — no hidden data mutation', () => {
  it('every line keeps ITS OWN product and price (no shared mutable row)', async () => {
    const list = await service(() => Promise.resolve(live)).getPriceList();

    expect(list.items.map(i => i.sku)).toEqual([
      'GYP6-0001',
      'GYP6-0002',
      'GYP6-0003',
    ]);
    expect(list.items.map(i => i.priceUsd)).toEqual([120, 450.5, 75.99]);
    expect(list.items.map(i => i.price)).toEqual(
      PRODUCTS.map(p => round2(p.price * RATE)),
    );
  });

  it('repeated calls give identical results and never touch the entities', async () => {
    const svc = service(() => Promise.resolve(live));
    const first = await svc.getPriceList();
    const second = await svc.getPriceList();

    expect(second).toEqual(first);
    expect(PRODUCTS.map(p => p.price)).toEqual([120, 450.5, 75.99]);
  });

  it('header reflects the live quote', async () => {
    const list = await service(() => Promise.resolve(live)).getPriceList();
    expect(list).toMatchObject({
      currency: 'UAH',
      rate: RATE,
      rateDate: '05.11.2026',
      rateSource: 'live',
      degraded: false,
      fxAttempts: 1,
    });
  });

  it('NBU down: USD list, rate null, price === priceUsd, degraded', async () => {
    const list = await service(() =>
      Promise.reject(new FxUnavailableError(3, 'timeout after 500 ms')),
    ).getPriceList();

    expect(list).toMatchObject({
      currency: 'USD',
      rate: null,
      rateDate: null,
      rateSource: 'unavailable',
      degraded: true,
      fxAttempts: 3,
    });
    expect(list.items.map(i => i.price)).toEqual([120, 450.5, 75.99]);
  });

  it('unexpected errors are not swallowed', async () => {
    const svc = service(() => Promise.reject(new TypeError('boom')));
    const error = await svc.getPriceList().catch((e: unknown) => e);
    expect(error).toBeInstanceOf(TypeError);
  });
});
