// Lab 7 — immutability contract of the price-list Value Objects.
import { describe, expect, it } from 'bun:test';

import { FxUnavailableError } from '@/infrastructure/fx';

import { FxQuote } from './fx-quote.vo';
import { Money } from './money.vo';
import { toPriceListItem } from './price-list-item';

describe('Value Objects are immutable', () => {
  it('Money: frozen, convert() returns a NEW object and keeps the original', () => {
    const usd = Money.usd(120);
    const uah = usd.convert(41.25, 'UAH');

    expect(Object.isFrozen(usd)).toBe(true);
    expect(() => {
      (usd as { amount: number }).amount = 1;
    }).toThrow(TypeError);
    expect(usd).toMatchObject({ amount: 120, currency: 'USD' });
    expect(uah).toMatchObject({ amount: 4950, currency: 'UAH' });
    expect(uah).not.toBe(usd);
  });

  it('Money rejects NaN / Infinity', () => {
    expect(() => Money.usd(Number.NaN)).toThrow(RangeError);
  });

  it('FxQuote and its header are frozen; unavailable() keeps USD and rate null', () => {
    const quote = FxQuote.unavailable(new FxUnavailableError(3, 'timeout'));

    expect(Object.isFrozen(quote)).toBe(true);
    expect(Object.isFrozen(quote.header)).toBe(true);
    expect(quote.header).toMatchObject({ currency: 'USD', rate: null });
    expect(() => FxQuote.unavailable(new Error('db down'))).toThrow('db down');
  });

  it('every price-list line is a separate frozen object', () => {
    const quote = FxQuote.live({
      currency: 'USD',
      rate: 41.25,
      date: '05.11.2026',
      source: 'live',
      attempts: 1,
    });
    const a = toPriceListItem(
      { id: 'a', sku: 'A', title: 'A', price: 1 },
      quote,
    );
    const b = toPriceListItem(
      { id: 'b', sku: 'B', title: 'B', price: 2 },
      quote,
    );

    expect(a).not.toBe(b);
    expect(Object.isFrozen(a)).toBe(true);
    expect([a.price, b.price]).toEqual([41.25, 82.5]);
  });
});
