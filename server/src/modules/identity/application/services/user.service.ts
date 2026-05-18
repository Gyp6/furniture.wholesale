import {
  type IUserRepository,
  USER_REPOSITORY,
} from '@identity/domain/contracts';
import {
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { MESSAGE } from '@/common/constants';
import { OtpService } from '@/modules/otp/otp.service';

import { UserResponse, VerifiedUserResponse } from '../dto/responses';
import { UserMapper } from '../mappers';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly otpService: OtpService,
  ) {}

  async getProfile(id: string): Promise<UserResponse> {
    const entity = await this.userRepository.findById(id);
    if (!entity) throw new NotFoundException('User not found');

    return UserMapper.toResponse(entity);
  }

  async resendOtp(id: string) {
    const entity = await this.userRepository.findById(id);
    if (!entity) throw new NotFoundException('User not found');
    if (entity.emailVerified)
      throw new ForbiddenException('Email is already verified');

    await this.otpService.sendCode(entity.email);
    return { message: MESSAGE.OTP_SENT };
  }

  async verifyEmail(
    id: string,
    email: string,
    code: string,
  ): Promise<VerifiedUserResponse> {
    const entity = await this.userRepository.findById(id);
    if (!entity) throw new NotFoundException('User not found');

    await this.otpService.verify(email, code);
    const updated = await this.userRepository.updateById(id, {
      emailVerified: true,
    });
    return {
      message: MESSAGE.VERIFIED_EMAIL,
      user: UserMapper.toResponse(updated),
    };
  }
}
