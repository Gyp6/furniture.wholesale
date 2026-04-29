import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { CurrentAbility } from '@/core/decorators';
import { type AppAbility } from '@/infrastructure/casl/casl.ability-factory';
import {
  UserResponse,
  VerifiedUserResponse,
} from '@/shared/dto/responses/user.response';
import { IReqUser } from '@/shared/types';
import {
  ApiAuthenticationErrorResponse,
  ApiValidationErrorResponse,
} from '@/shared/validators';

import { EmailVerifyRequest } from './dto/requests/email-verify.request';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
