import { PriceListResponse } from '@catalog/application/dto/responses';
import { FxQuote, toPriceListItem } from '@catalog/application/value-objects';
import {
  type IProductRepository,
  PRODUCT_REPOSITORY,
} from '@catalog/domain/contracts';
import { Inject, Injectable } from '@nestjs/common';

import { ExchangeRateClient } from '@/infrastructure/fx';

/**
 * Wholesale price list in the buyer's currency (UAH).
 * Product prices are stored in USD (PostgreSQL); the rate comes from the NBU API.
 *
 * Graceful degradation: if NBU is down and there is no cached rate,
 * the list is still returned — in the base currency (USD) with `degraded: true`,
 * instead of HTTP 500 for the whole catalog.
 *
 * Lab 7: no mutable state. The FX state is one immutable Value Object
 * (FxQuote), money is an immutable Money, every line is a new frozen object.
 */
@Injectable()
export class PriceListService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    private readonly fxClient: ExchangeRateClient,
  ) {}

  async getPriceList(): Promise<PriceListResponse> {
    const [products, quote] = await Promise.all([
      this.productRepository.findAll(),
      this.fxClient.getRate('USD').then(FxQuote.live, FxQuote.unavailable),
    ]);
    return {
      ...quote.header,
      items: products.map(p => toPriceListItem(p, quote)),
    };
  }
}
