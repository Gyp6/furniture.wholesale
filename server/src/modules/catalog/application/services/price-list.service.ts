import { PriceListResponse } from '@catalog/application/dto/responses';
import {
  type IProductRepository,
  PRODUCT_REPOSITORY,
} from '@catalog/domain/contracts';
import { Inject, Injectable } from '@nestjs/common';

import { ExchangeRateClient } from '@/infrastructure/fx';

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Wholesale price list in the buyer's currency (UAH).
 * Product prices are stored in USD (PostgreSQL); the rate comes from the NBU API.
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
      this.fxClient.getRate('USD'),
    ]);

    return {
      currency: 'UAH',
      rate: fx.rate,
      rateDate: fx.date,
      rateSource: 'live',
      degraded: false,
      items: products.map(p => ({
        id: p.id,
        sku: p.sku,
        title: p.title,
        priceUsd: p.price,
        price: round2(p.price * fx.rate),
      })),
    };
  }
}
