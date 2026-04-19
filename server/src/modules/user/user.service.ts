import { subject } from '@casl/ability';
import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { AppAbility } from '@/infrastructure/casl/casl.ability-factory';

import { OtpService } from '../otp/otp.service';

import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly otpService: OtpService,
  ) {}

  async getProfile(userId: string, ability: AppAbility) {
    const user = await this.userRepository.findById(userId);

    this.logger.debug(`Fetched user profile for userId: ${userId}`);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (ability.cannot('read', subject('User', user))) {
      throw new ForbiddenException(
        'You do not have permission to access this profile',
      );
    }

    return user;
  }

  async verifyEmail(email: string, code: string) {
    await this.otpService.verify(email, code);

    const updatedUser = await this.userRepository.updateByEmail(email, {
      emailVerified: true,
    });

    return { message: 'Email verified successfully', user: updatedUser };
  }
}
