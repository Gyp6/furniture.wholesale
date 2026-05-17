import { S3Client } from '@aws-sdk/client-s3';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import {
  AuthGuard as BetterAuthGuard,
  AuthModule as BetterAuthModule,
} from '@thallesp/nestjs-better-auth';

import { IMailOptions } from '@/common/types';
import { CaslModule } from '@/infrastructure/casl/casl.module';
import { MailModule } from '@/infrastructure/mail/mail.module';
import { MailService } from '@/infrastructure/mail/mail.service';
import { PrismaModule } from '@/infrastructure/prisma/prisma.module';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { RedisModule } from '@/infrastructure/redis/redis.module';
import { S3Module } from '@/infrastructure/s3/s3.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { CatalogModule } from '@/modules/catalog/catalog.module';
import { IdentityModule } from '@/modules/identity/identity.module';
import { OtpModule } from '@/modules/otp/otp.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AbilitiesGuard } from './guards/abilities.guard';
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
      imports: [PrismaModule, ConfigModule],
      useFactory: (
        prismaService: PrismaService,
        configService: ConfigService,
        mailService: MailService,
      ) => ({
        auth: createAuth(prismaService, configService, mailService),
        disableTrustedOriginsCors: true,
      }),
      inject: [PrismaService, ConfigService, MailService],
    }),
    AuthModule,
    CaslModule,
    IdentityModule,
    CatalogModule,
    OtpModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
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
export class AppModule {}
