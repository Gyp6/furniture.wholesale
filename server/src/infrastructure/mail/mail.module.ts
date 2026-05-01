import { BullModule } from '@nestjs/bullmq';
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';

import { IMailOptions } from '@/shared/types';

import { MailProcessor } from './mail.processor';
import { MailService } from './mail.service';

@Global()
@Module({})
export class MailModule {
  static forRootAsync(options: {
    useFactory: (...args: any[]) => Promise<IMailOptions> | IMailOptions;
    inject?: any[];
  }): DynamicModule {
    const optionsProvider: Provider = {
      provide: 'MAIL_OPTIONS',
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    return {
      module: MailModule,
      imports: [BullModule.registerQueue({ name: 'mail_queue' })],
      providers: [optionsProvider, MailService, MailProcessor],
      exports: [MailService],
    };
  }
}
