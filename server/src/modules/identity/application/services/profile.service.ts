import {
  type IProfileRepository,
  PROFILE_REPOSITORY,
} from '@identity/domain/contracts';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { ProfileResponse } from '../dto/responses';
import { ProfileMapper } from '../mappers';

@Injectable()
export class ProfileService {
  constructor(
    @Inject(PROFILE_REPOSITORY)
    private readonly profileRepository: IProfileRepository,
  ) {}

  async getByUserId(userId: string): Promise<ProfileResponse> {
    const entity = await this.profileRepository.findByUserId(userId);
    if (!entity) throw new NotFoundException('Profile not found');
    return ProfileMapper.toResponse(entity);
  }

  async getEntityByUserId(userId: string) {
    const entity = await this.profileRepository.findByUserId(userId);
    if (!entity) throw new NotFoundException('Profile not found');
    return entity;
  }
}
