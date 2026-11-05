import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ExchangeRateClient } from './exchange-rate.client';
import { fxOptionsFromConfig } from './fx.config';
import { FX_FETCH, FX_OPTIONS } from './fx.constants';

@Global()
@Module({
  providers: [
    {
      provide: FX_FETCH,
      useValue: (url: string, init?: RequestInit) => fetch(url, init),
    },
    {
      provide: FX_OPTIONS,
      useFactory: fxOptionsFromConfig,
      inject: [ConfigService],
    },
    ExchangeRateClient,
  ],
  exports: [ExchangeRateClient],
})
export class FxModule {}
