import type { PriceListResponse } from '@catalog/application/dto/responses';

import { FxUnavailableError, type IFxResult } from '@/infrastructure/fx';

import { Money } from './money.vo';

export type PriceListHeader = Readonly<Omit<PriceListResponse, 'items'>>;

/**
 * Value Object: the FX state used for ONE price list.
 * Groups currency, rate, rate date, source, degraded flag and attempts —
 * six loose variables of the old method — into one frozen object, and owns
 * the only decision about them (live quote vs. NBU unavailable).
 */
export class FxQuote {
  private constructor(
    readonly header: PriceListHeader,
    private readonly factor: number,
  ) {
    Object.freeze(this);
  }

  static readonly live = (result: IFxResult): FxQuote =>
    new FxQuote(
      Object.freeze({
        currency: 'UAH',
        rate: result.rate,
        rateDate: result.date,
        rateSource: result.source,
        degraded: result.source !== 'live',
        fxAttempts: result.attempts,
      }),
      result.rate,
    );

  /** Graceful degradation: base currency, no rate. Other errors are re-thrown. */
  static readonly unavailable = (error: unknown): FxQuote => {
    if (!(error instanceof FxUnavailableError)) throw error;
    return new FxQuote(
      Object.freeze({
        currency: 'USD',
        rate: null,
        rateDate: null,
        rateSource: 'unavailable',
        degraded: true,
        fxAttempts: error.attempts,
      }),
      1,
    );
  };

  convert(base: Money): Money {
    return base.convert(this.factor, this.header.currency as 'USD' | 'UAH');
  }
}
