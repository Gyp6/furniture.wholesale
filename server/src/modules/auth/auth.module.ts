import { Module } from '@nestjs/common';

import { IdentityModule } from '@/modules/identity/identity.module';
import { OtpModule } from '@/modules/otp/otp.module';

import { AuthController } from './auth.controller';
import { AuthHook } from './auth.hook';
import { LoginService, RecoveryService, RegisterService } from './services';

@Module({
  imports: [IdentityModule, OtpModule],
  controllers: [AuthController],
  providers: [AuthHook, RegisterService, LoginService, RecoveryService],
})
export class AuthModule {}
