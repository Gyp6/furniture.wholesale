export type Currency = 'USD' | 'UAH';

/**
 * Value Object: an amount of money in a currency.
 * Immutable — every operation returns a NEW Money; the instance is frozen,
 * so `money.amount = …` throws at runtime and does not compile.
 */
export class Money {
  private constructor(
    readonly amount: number,
    readonly currency: Currency,
  ) {
    Object.freeze(this);
  }

  static of(amount: number, currency: Currency): Money {
    if (!Number.isFinite(amount)) {
      throw new RangeError(`Money amount must be finite, got ${amount}`);
    }
    return new Money(amount, currency);
  }

  static usd(amount: number): Money {
    return Money.of(amount, 'USD');
  }

  /** New Money in `to`, rounded to cents (the original stays untouched). */
  convert(rate: number, to: Currency): Money {
    return Money.of(Math.round(this.amount * rate * 100) / 100, to);
  }
}
