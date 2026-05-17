import { S3Client } from '@aws-sdk/client-s3';
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { S3_CLIENT } from './s3.constants';
import { S3Service } from './s3.service';

@Global()
@Module({})
export class S3Module {
  static forRootAsync(options: {
    useFactory: (...args: any[]) => S3Client;
    inject?: any[];
  }): DynamicModule {
    const optionsProvider: Provider = {
      provide: S3_CLIENT,
      useFactory: options.useFactory,
      inject: options.inject || [],
    };

    return {
      module: S3Module,
      imports: [ConfigModule],
      providers: [optionsProvider, S3Service],
      exports: [optionsProvider, S3Service],
    };
  }
}
