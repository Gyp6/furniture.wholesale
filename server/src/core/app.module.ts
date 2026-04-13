import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard, AuthModule } from '@thallesp/nestjs-better-auth';

import { PrismaModule } from '@/infrastructure/prisma/prisma.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggingMiddleware } from './middleware';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { createAuth } from './lib';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule.forRootAsync({
      imports: [PrismaModule, ConfigModule],
      useFactory: (prisma: PrismaService, configService: ConfigService) => ({
        auth: createAuth(prisma, configService),
      }),
      inject: [PrismaService, ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggingMiddleware)
      .forRoutes({ path: '*path', method: RequestMethod.ALL }); // Логувати взагалі все
  }
}
