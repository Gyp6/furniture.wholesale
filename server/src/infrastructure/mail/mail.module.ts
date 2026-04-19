// infrastructure/mail/mail.module.ts
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';

import { MailOptions } from '@/shared/interfaces/mail-options.interface';

import { MailProcessor } from './mail.processor';
import { MailService } from './mail.service';

@Global()
@Module({})
export class MailModule {
  static forRootAsync(options: {
    useFactory: (...args: any[]) => Promise<MailOptions> | MailOptions;
    inject?: any[];
  }): DynamicModule {
    const optionsProvider: Provider = {
      provide: 'MAIL_OPTIONS',
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    return {
      module: MailModule,
      providers: [optionsProvider, MailService, MailProcessor],
      exports: [MailService],
    };
  }
}
