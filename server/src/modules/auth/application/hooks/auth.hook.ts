import { Injectable } from '@nestjs/common';
import {
  AfterHook,
  type AuthHookContext,
  BeforeHook,
  Hook,
} from '@thallesp/nestjs-better-auth';

import { LoginService, RecoveryService, RegisterService } from '../services';

@Injectable()
@Hook()
export class AuthHook {
  constructor(
    private readonly registerService: RegisterService,
    private readonly loginService: LoginService,
    private readonly recoveryService: RecoveryService,
  ) {}

  @BeforeHook('/sign-in/email')
  async beforeSignIn(context: AuthHookContext) {
    await this.loginService.beforeSignIn(context);
  }

  @BeforeHook('/sign-up/email')
  async beforeSignUp(context: AuthHookContext) {
    await this.registerService.beforeSignUp(context);
  }

  @AfterHook('/sign-up/email')
  afterSignUp(context: AuthHookContext) {
    this.registerService.afterSignUp(context);
  }

  @BeforeHook('/reset-password')
  async beforeResetPassword(context: AuthHookContext) {
    await this.recoveryService.beforeResetPassword(context);
  }

  @AfterHook('/request-password-reset')
  async afterForgetPassword(context: AuthHookContext) {
    await this.recoveryService.sendLink(context);
  }
}
