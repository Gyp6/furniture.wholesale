import { Body, Controller, Get, Inject, Post, Req } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from '@thallesp/nestjs-better-auth';

import { UserResponse, VerifiedUserResponse } from '@/common/dto/responses';
import { IReqUser } from '@/common/types';
import {
  ApiAuthenticationErrorResponse,
  ApiValidationErrorResponse,
} from '@/common/validators';
import { CurrentAbility } from '@/core/decorators';
import type { Auth } from '@/core/lib';
import { type AppAbility } from '@/infrastructure/casl/casl.ability-factory';

import { EmailVerifyRequest } from './dto/requests';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService<Auth>,
  ) {}

  @ApiOperation({ summary: 'Return user object endpoint' })
  @ApiOkResponse({ type: UserResponse })
  @ApiAuthenticationErrorResponse()
  @Get('me')
  async getMe(
    @Req() { user: { id } }: { user: IReqUser },
    @CurrentAbility() ability: AppAbility,
  ) {
    return await this.userService.getProfile(id, ability);
  }

  @Get('check-session')
  async checkSession(@Req() req: Request) {
    return await this.authService.api.getSession({ headers: req.headers });
  }

  @ApiOperation({ summary: 'Return user object endpoint' })
  @ApiOkResponse({ example: { message: 'OTP sent successfully' } })
  @ApiAuthenticationErrorResponse()
  @Get('resend-otp')
  async resendOtp(
    @Req() { user: { id } }: { user: IReqUser },
    @CurrentAbility() ability: AppAbility,
  ) {
    return await this.userService.resendOtp(id, ability);
  }

  @ApiOperation({ summary: 'Verify email endpoint' })
  @ApiOkResponse({ type: VerifiedUserResponse })
  @ApiValidationErrorResponse()
  @ApiAuthenticationErrorResponse()
  @Post('verify-email')
  async verifyEmail(
    @Req() { user: { id, email } }: { user: IReqUser },
    @CurrentAbility() ability: AppAbility,
    @Body() { code }: EmailVerifyRequest,
  ) {
    return await this.userService.verifyEmail(id, email, code, ability);
  }
}
