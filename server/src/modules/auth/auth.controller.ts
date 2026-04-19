import {
  BadRequestException,
  Body,
  Controller,
  Logger,
  Post,
} from '@nestjs/common';
import { Role } from '@prisma/client';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

import { OtpService } from '../otp/otp.service';
import { UserRepository } from '../user/user.repository';

import { RegisterRetailerRequest } from './dto/requests';
import { RecoveryService, RegisterService } from './services';

@Controller('auth-custom')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly registerService: RegisterService,
    private readonly recoveryService: RecoveryService,
    private readonly otpService: OtpService,
    private readonly userRepository: UserRepository,
  ) {}

  @AllowAnonymous()
  @Post('register')
  async register(@Body() dto: RegisterRetailerRequest) {
    this.logger.debug(
      `Registration attempt for email: ${dto.email}, role: ${dto.type}`,
    );

    switch (dto.type as Role) {
      case Role.RETAILER:
        return this.registerService.registerRetailer(dto);

      case Role.DESIGNER:
        // return this.designerService.registerDesigner(dto);
        throw new BadRequestException(
          'Designer registration is not implemented yet',
        );

      default:
        throw new BadRequestException('Unsupported role for registration');
    }
  }

  @AllowAnonymous()
  @Post('verify-email')
  async verifyEmail(@Body() dto: { email: string; code: string }) {
    await this.otpService.verify(dto.email, dto.code);

    const updatedUser = await this.userRepository.updateByEmail(dto.email, {
      emailVerified: true,
    });

    return { message: 'Email verified successfully', user: updatedUser };
  }
}
