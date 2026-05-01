import { Module } from '@nestjs/common';

import { CompanyModule } from '../company/company.module';
import { OtpModule } from '../otp/otp.module';
import { UserModule } from '../user/user.module';

import { AuthController } from './auth.controller';
import { AuthHook } from './auth.hook';
import { LoginService, RecoveryService, RegisterService } from './services';

@Module({
  imports: [UserModule, CompanyModule, OtpModule],
  controllers: [AuthController],
  providers: [AuthHook, RegisterService, LoginService, RecoveryService],
})
export class AuthModule {}
