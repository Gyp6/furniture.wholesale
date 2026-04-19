import { subject } from '@casl/ability';
import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { AppAbility } from '@/infrastructure/casl/casl.ability-factory';

import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

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
}
