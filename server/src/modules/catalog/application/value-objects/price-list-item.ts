import type { PriceListItemResponse } from '@catalog/application/dto/responses';

import type { FxQuote } from './fx-quote.vo';
import { Money } from './money.vo';

type PricedProduct = Readonly<{
  id: string;
  sku: string;
  title: string;
  price: number;
}>;

/** A NEW frozen line per product — no shared buffer, no writes to the entity. */
export const toPriceListItem = (
  product: PricedProduct,
  quote: FxQuote,
): Readonly<PriceListItemResponse> => {
  const base = Money.usd(product.price);
  return Object.freeze({
    id: product.id,
    sku: product.sku,
    title: product.title,
    priceUsd: base.amount,
    price: quote.convert(base).amount,
  });
};
