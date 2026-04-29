import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { ApiValidationErrorResponse } from '@/shared/validators';

import {
  ForgetPasswordRequest,
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
} from './dto/requests';
import {
  ForgetPasswordResponse,
  LoginResponse,
  RegisterResponse,
  ResetPasswordResponse,
} from './dto/responses';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  @ApiOperation({ summary: 'Register a new user endpoint' })
  @ApiOkResponse({ type: RegisterResponse })
  @ApiValidationErrorResponse()
  @Post('sign-up/email')
  signUp(@Body() _body: RegisterRequest): void {}

  @ApiOperation({ summary: 'Login user endpoint' })
  @ApiOkResponse({ type: LoginResponse })
  @ApiUnauthorizedResponse({
    description: 'Invalid email or password or user not found',
    example: {
      message: 'Invalid email or password',
      code: 'INVALID_EMAIL_OR_PASSWORD',
    },
  })
  @ApiValidationErrorResponse()
  @Post('sign-in/email')
  signIn(@Body() _body: LoginRequest): void {}

  @ApiOperation({ summary: 'Forgot user password endpoint' })
  @ApiOkResponse({ type: ForgetPasswordResponse })
  @ApiValidationErrorResponse()
  @Post('request-password-reset')
  forgetPassword(@Body() _body: ForgetPasswordRequest): void {}

  @ApiOperation({ summary: 'Reset user password endpoint' })
  @ApiOkResponse({ type: ResetPasswordResponse })
  @ApiValidationErrorResponse()
  @Post('reset-password')
  resetPassword(@Body() _body: ResetPasswordRequest): void {}
}
