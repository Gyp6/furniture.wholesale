import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import {
  AuthGuard as BetterAuthGuard,
  AuthModule as BetterAuthModule,
} from '@thallesp/nestjs-better-auth';

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
          host: config.get('REDIS_HOST'),
          port: config.get('REDIS_PORT'),
          password: config.get('REDIS_PASSWORD'),
          username: config.get('REDIS_USER'),
        },
      }),
    }),
    MailModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        apiKey: config.getOrThrow('RESEND_API_KEY'),
        from: 'onboarding@resend.dev',
      }),
    }),
    BetterAuthModule.forRootAsync({
      imports: [PrismaModule, ConfigModule],
      useFactory: (prisma: PrismaService) => ({
        auth: createAuth(prisma),
      }),
      inject: [PrismaService, ConfigService],
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
