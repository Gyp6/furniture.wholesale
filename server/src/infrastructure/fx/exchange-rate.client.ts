import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { FX_FETCH, NBU_EXCHANGE_URL } from './fx.constants';
import type { IExchangeRate, INbuRateDto, TFetch } from './fx.types';

export class FxResponseError extends Error {
  constructor(public readonly status: number) {
    super(`Exchange-rate provider responded with HTTP ${status}`);
    this.name = 'FxResponseError';
  }
}

export function parseNbuRate(body: unknown, currency: string): IExchangeRate {
  const item = Array.isArray(body)
    ? (body as INbuRateDto[]).find(r => r.cc === currency)
    : undefined;
  if (!item || !(item.rate > 0)) {
    throw new Error(`Exchange-rate provider returned no rate for ${currency}`);
  }
  return { rate: item.rate, currency: item.cc, date: item.exchangedate };
}

/** HTTP client of the National Bank of Ukraine exchange-rate API (external dependency). */
@Injectable()
export class ExchangeRateClient {
  private readonly logger = new Logger(ExchangeRateClient.name);
  private readonly baseUrl: string;

  constructor(
    config: ConfigService,
    @Inject(FX_FETCH) private readonly fetchFn: TFetch,
  ) {
    this.baseUrl = config.get<string>('FX_API_URL') || NBU_EXCHANGE_URL;
  }

  async getRate(currency = 'USD'): Promise<IExchangeRate> {
    const url = `${this.baseUrl}?valcode=${currency}&json`;
    const response = await this.fetchFn(url);
    if (!response.ok) throw new FxResponseError(response.status);
    return parseNbuRate(await response.json(), currency);
  }
}
