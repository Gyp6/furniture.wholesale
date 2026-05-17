import { Module } from '@nestjs/common';

import { CompanyModule } from '../company/company.module';
import { OtpModule } from '../otp/otp.module';

import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [CompanyModule, OtpModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserService, UserRepository],
})
export class UserModule {}
