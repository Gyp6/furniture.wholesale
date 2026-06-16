import { Module } from '@nestjs/common';

import { IdentityModule } from '@/modules/identity/identity.module';

import { AuthHook } from './application/hooks';
import {
  LoginService,
  RecoveryService,
  RegisterService,
} from './application/services';
import { AuthController } from './infrastructure/api';

const imports = [IdentityModule];
const controllers = [AuthController];
const hooks = [AuthHook];
const services = [RegisterService, LoginService, RecoveryService];

@Module({
  imports: [...imports],
  controllers: [...controllers],
  providers: [...hooks, ...services],
})
export class AuthModule {}
