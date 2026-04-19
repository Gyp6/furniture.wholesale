import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

import { CurrentAbility } from '@/core/decorators';
import { type AppAbility } from '@/infrastructure/casl/casl.ability-factory';

import { EmailVerifyRequest } from './dto/requests/email-verify.request';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('me')
  async getMe(@Req() req, @CurrentAbility() ability: AppAbility) {
    const userId: string = await req.user.id;

    return await this.userService.getProfile(userId, ability);
  }

  @AllowAnonymous()
  @Post('verify-email')
  async verifyEmail(@Body() { email, code }: EmailVerifyRequest) {
    return await this.userService.verifyEmail(email, code);
  }
}
