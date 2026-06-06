import { AuthModule } from '@auth/auth.module';
import { S3Client } from '@aws-sdk/client-s3';
import { BundleModule } from '@bundle/bundle.module';
import { CatalogModule } from '@catalog/catalog.module';
import { LoggingMiddleware } from '@core/infrastructure/middleware';
import { IdentityModule } from '@identity/identity.module';
import { BullModule } from '@nestjs/bullmq';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import {
  AuthGuard as BetterAuthGuard,
  AuthModule as BetterAuthModule,
} from '@thallesp/nestjs-better-auth';

import { IMailOptions } from '@/common/types';
import { CaslModule } from '@/infrastructure/casl/casl.module';
import { MailModule } from '@/infrastructure/mail/mail.module';
import { MailService } from '@/infrastructure/mail/mail.service';
import { OtpModule } from '@/infrastructure/otp/otp.module';
import { PrismaModule } from '@/infrastructure/prisma/prisma.module';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { RedisModule } from '@/infrastructure/redis/redis.module';
import { RedisService } from '@/infrastructure/redis/redis.service';
import { S3Module } from '@/infrastructure/s3/s3.module';
import { SmartSkuModule } from '@/infrastructure/smart-sku/smart-sku.module';

import { AbilitiesGuard } from './application/guards';
import { HealthService } from './application/services';
import { HealthController } from './infrastructure/api';
import { createAuth } from './lib';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    RedisModule,
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.getOrThrow('REDIS_HOST'),
          port: configService.getOrThrow('REDIS_PORT'),
          password: configService.getOrThrow('REDIS_PASSWORD'),
          username: configService.getOrThrow('REDIS_USER'),
        },
      }),
      inject: [ConfigService],
    }),
    MailModule.forRootAsync({
      useFactory: (configService: ConfigService): IMailOptions => ({
        apiKey: configService.getOrThrow('RESEND_API_KEY'),
        from: configService.getOrThrow('RESEND_MAIL_FROM'),
      }),
      inject: [ConfigService],
    }),
    S3Module.forRootAsync({
      useFactory: (configService: ConfigService) =>
        new S3Client({
          region: configService.getOrThrow('S3_REGION'),
          endpoint: configService.getOrThrow('S3_ENDPOINT'),
          forcePathStyle: true,
          credentials: {
            accessKeyId: configService.getOrThrow('S3_ACCESS_KEY'),
            secretAccessKey: configService.getOrThrow('S3_SECRET_KEY'),
          },
        }),
      inject: [ConfigService],
    }),
    BetterAuthModule.forRootAsync({
      imports: [],
      useFactory: (
        prismaService: PrismaService,
        configService: ConfigService,
        mailService: MailService,
        redisService: RedisService,
      ) => ({
        auth: createAuth(
          prismaService,
          configService,
          mailService,
          redisService,
        ),
        disableTrustedOriginsCors: true,
      }),
      inject: [PrismaService, ConfigService, MailService, RedisService],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100,
      },
      {
        name: 'auth',
        ttl: 900000, // 15 minutes
        limit: 5,
      },
    ]),
    AuthModule,
    CaslModule,
    IdentityModule,
    CatalogModule,
    BundleModule,
    OtpModule,
    SmartSkuModule,
  ],
  controllers: [HealthController],
  providers: [
    HealthService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: BetterAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AbilitiesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
