import { Global, Module } from '@nestjs/common';

import { ExchangeRateClient } from './exchange-rate.client';
import { FX_FETCH } from './fx.constants';

@Global()
@Module({
  providers: [
    { provide: FX_FETCH, useValue: (url: string, init?: RequestInit) => fetch(url, init) },
    ExchangeRateClient,
  ],
  exports: [ExchangeRateClient],
})
export class FxModule {}
