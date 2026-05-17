import { Module } from '@nestjs/common';

import { OtpModule } from '@/modules/otp/otp.module';

import {
  CompanyService,
  ProfileService,
  UserService,
} from './application/services';
import {
  COMPANY_REPOSITORY,
  PROFILE_REPOSITORY,
  USER_REPOSITORY,
} from './domain/contracts';
import { CompanyController, UserController } from './infrastructure/api';
import {
  CompanyRepository,
  ProfileRepository,
  UserRepository,
} from './infrastructure/repositories';

const controllers = [UserController, CompanyController];
const services = [UserService, ProfileService, CompanyService];
const repositories = [
  { provide: USER_REPOSITORY, useClass: UserRepository },
  { provide: PROFILE_REPOSITORY, useClass: ProfileRepository },
  { provide: COMPANY_REPOSITORY, useClass: CompanyRepository },
];

@Module({
  imports: [OtpModule],
  controllers: [...controllers],
  providers: [...repositories, ...services],
  exports: [...repositories, ...services],
})
export class IdentityModule {}
