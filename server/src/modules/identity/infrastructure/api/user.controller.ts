import { EmailVerifyRequest } from '@identity/application/dto/requests';
import {
  UserResponse,
  VerifiedUserResponse,
} from '@identity/application/dto/responses';
import { UserService } from '@identity/application/services';
import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthService } from '@thallesp/nestjs-better-auth';

import { MESSAGE } from '@/common/constants';
import { IReqUser } from '@/common/types';
import {
  ApiAuthenticationErrorResponse,
  ApiValidationErrorResponse,
} from '@/common/validators';
import type { Auth } from '@/core/lib';

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
  @SkipThrottle()
  async getMe(
    @Req() { user: { id } }: { user: IReqUser },
  ): Promise<UserResponse> {
    return await this.userService.getProfile(id);
  }

  @ApiOperation({ summary: 'Check session endpoint' })
  @ApiOkResponse({
    description: 'Returns the current session and user data',
    schema: {
      type: 'object',
      properties: {
        user: { type: 'object' },
        session: { type: 'object' },
      },
    },
  })
  @ApiAuthenticationErrorResponse()
  @Get('check-session')
  @SkipThrottle()
  async checkSession(@Req() req: Request) {
    return await this.authService.api.getSession({ headers: req.headers });
  }

  @ApiOperation({ summary: 'Resend OTP endpoint' })
  @ApiOkResponse({ example: { message: MESSAGE.OTP_SENT } })
  @ApiAuthenticationErrorResponse()
  @Get('resend-otp')
  async resendOtp(@Req() { user: { id } }: { user: IReqUser }) {
    return await this.userService.resendOtp(id);
  }

  @ApiOperation({ summary: 'Verify email endpoint' })
  @ApiOkResponse({ type: VerifiedUserResponse })
  @ApiValidationErrorResponse()
  @ApiAuthenticationErrorResponse()
  @Post('verify-email')
  async verifyEmail(
    @Req() { user: { id, email } }: { user: IReqUser },
    @Body() { code }: EmailVerifyRequest,
  ): Promise<VerifiedUserResponse> {
    return await this.userService.verifyEmail(id, email, code);
  }
}
