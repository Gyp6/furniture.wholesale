import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { CompanyModule } from '../company/company.module';
import { OtpModule } from '../otp/otp.module';
import { UserModule } from '../user/user.module';

import { AuthController } from './auth.controller';
import { AuthHook } from './auth.hook';
import { RecoveryService, RegisterService } from './services';

@Module({
  imports: [
    UserModule,
    CompanyModule,
    OtpModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
    BullModule.registerQueue({
      name: 'mail_queue',
    }),
  ],
  controllers: [AuthController],
  providers: [AuthHook, RegisterService, RecoveryService],
})
export class AuthModule {}
