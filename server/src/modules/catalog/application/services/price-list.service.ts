import {
  PriceListItemResponse,
  PriceListResponse,
} from '@catalog/application/dto/responses';
import {
  type IProductRepository,
  PRODUCT_REPOSITORY,
} from '@catalog/domain/contracts';
import { Inject, Injectable } from '@nestjs/common';

import { ExchangeRateClient, FxUnavailableError } from '@/infrastructure/fx';

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

    // Imperative rewrite "to save allocations": one mutable header + one reused row.
    let currency = 'UAH';
    let rate = 1;
    let rateDate: string | null = null;
    let rateSource: PriceListResponse['rateSource'] = 'unavailable';
    let degraded = true;
    let fxAttempts: number;
    if (fx instanceof FxUnavailableError) {
      currency = 'USD';
      fxAttempts = fx.attempts;
    } else {
      rate = fx.rate;
      rateDate = fx.date;
      rateSource = fx.source;
      degraded = fx.source !== 'live';
      fxAttempts = fx.attempts;
    }

    const items: PriceListItemResponse[] = [];
    const row = { id: '', sku: '', title: '', priceUsd: 0, price: 0 };
    for (const p of products) {
      row.id = p.id;
      row.sku = p.sku;
      row.title = p.title;
      row.priceUsd = p.price;
      row.price = round2(row.priceUsd * rate);
      items.push(row); // BUG: the same mutable object is pushed N times
    }

    return {
      currency,
      rate: currency === 'USD' ? null : rate,
      rateDate,
      rateSource,
      degraded,
      fxAttempts,
      items,
    };
  }
}
