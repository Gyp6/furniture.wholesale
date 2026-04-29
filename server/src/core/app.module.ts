import { BullModule, getQueueToken } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import {
  AuthGuard as BetterAuthGuard,
  AuthModule as BetterAuthModule,
} from '@thallesp/nestjs-better-auth';
import { Queue } from 'bullmq';

import { CaslModule } from '@/infrastructure/casl/casl.module';
import { MailModule } from '@/infrastructure/mail/mail.module';
import { PrismaModule } from '@/infrastructure/prisma/prisma.module';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { RedisModule } from '@/infrastructure/redis/redis.module';
import { AuthModule } from '@/modules/auth/auth.module';
import { CompanyModule } from '@/modules/company/company.module';
import { OtpModule } from '@/modules/otp/otp.module';
import { UserModule } from '@/modules/user/user.module';

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
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        connection: {
          host: config.getOrThrow('REDIS_HOST'),
          port: config.getOrThrow('REDIS_PORT'),
          password: config.getOrThrow('REDIS_PASSWORD'),
          username: config.getOrThrow('REDIS_USER'),
        },
      }),
    }),
    MailModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        apiKey: config.getOrThrow('RESEND_API_KEY'),
        from: config.getOrThrow('RESEND_MAIL_FROM'),
      }),
    }),
    BetterAuthModule.forRootAsync({
      imports: [
        PrismaModule,
        ConfigModule,
        BullModule.registerQueue({ name: 'mail_queue' }),
      ],
      useFactory: (
        prismaService: PrismaService,
        configService: ConfigService,
        mailQueue: Queue,
      ) => ({
        auth: createAuth(prismaService, configService, mailQueue),
        disableTrustedOriginsCors: true,
      }),
      inject: [PrismaService, ConfigService, getQueueToken('mail_queue')],
    }),
    AuthModule,
    CaslModule,
    UserModule,
    CompanyModule,
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
