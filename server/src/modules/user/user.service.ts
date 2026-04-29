import { subject } from '@casl/ability';
import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { AppAbility } from '@/infrastructure/casl/casl.ability-factory';
import { ECalsAction } from '@/shared/enums';

import { OtpService } from '../otp/otp.service';

import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly otpService: OtpService,
  ) {}

  async getProfile(id: string, ability: AppAbility) {
    const user = await this.userRepository.findById(id);

    this.logger.debug(`Fetched user profile for userId: ${id}`);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (ability.cannot(ECalsAction.Read, subject('User', user))) {
      throw new ForbiddenException(
        'You do not have permission to access this profile',
      );
    }

    return user;
  }

  async resendOtp(id: string, ability: AppAbility) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.emailVerified) {
      throw new ForbiddenException('Email is already verified');
    }

    if (ability.cannot(ECalsAction.Read, subject('User', user))) {
      throw new ForbiddenException(
        'You do not have permission to resend email verification OTP for this user',
      );
    }

    await this.otpService.sendCode(user.email);

    return { message: 'OTP sent successfully' };
  }

  async verifyEmail(
    id: string,
    email: string,
    code: string,
    ability: AppAbility,
  ) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (ability.cannot(ECalsAction.Update, subject('User', user))) {
      throw new ForbiddenException(
        'You do not have permission to verify this email',
      );
    }

    await this.otpService.verify(email, code);

    const updatedUser = await this.userRepository.updateById(id, {
      emailVerified: true,
    });

    return { message: 'Email verified successfully', user: updatedUser };
  }
}
