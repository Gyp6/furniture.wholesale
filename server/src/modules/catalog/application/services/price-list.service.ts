import { PriceListResponse } from '@catalog/application/dto/responses';
import {
  type IProductRepository,
  PRODUCT_REPOSITORY,
} from '@catalog/domain/contracts';
import { Inject, Injectable } from '@nestjs/common';

import {
  ExchangeRateClient,
  FxUnavailableError,
  type IFxResult,
} from '@/infrastructure/fx';

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Wholesale price list in the buyer's currency (UAH).
 * Product prices are stored in USD (PostgreSQL); the rate comes from the NBU API.
 *
 * Graceful degradation: if NBU is down and there is no cached rate,
 * the list is still returned — in the base currency (USD) with `degraded: true`,
 * instead of HTTP 500 for the whole catalog.
 */
@Injectable()
export class PriceListService {
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    private readonly fxClient: ExchangeRateClient,
  ) {}

  async getPriceList(): Promise<PriceListResponse> {
    const [products, fx] = await Promise.all([
      this.productRepository.findAll(),
      this.fxClient.getRate('USD').catch((error: unknown) => {
        if (error instanceof FxUnavailableError) return error;
        throw error;
      }),
    ]);

    const items = (rate: number) =>
      products.map(p => ({
        id: p.id,
        sku: p.sku,
        title: p.title,
        priceUsd: p.price,
        price: round2(p.price * rate),
      }));

    if (fx instanceof FxUnavailableError) {
      return {
        currency: 'USD',
        rate: null,
        rateDate: null,
        rateSource: 'unavailable',
        degraded: true,
        fxAttempts: fx.attempts,
        items: items(1),
      };
    }

    const result: IFxResult = fx;
    return {
      currency: 'UAH',
      rate: result.rate,
      rateDate: result.date,
      rateSource: result.source,
      degraded: result.source !== 'live',
      fxAttempts: result.attempts,
      items: items(result.rate),
    };
  }
}
