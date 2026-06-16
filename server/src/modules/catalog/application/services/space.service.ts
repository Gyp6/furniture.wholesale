import {
  type ISpaceRepository,
  SPACE_REPOSITORY,
} from '@catalog/domain/contracts';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { SpaceResponse } from '../dto/responses';
import { SpaceMapper } from '../mappers';

@Injectable()
export class SpaceService {
  constructor(
    @Inject(SPACE_REPOSITORY)
    private readonly spaceRepository: ISpaceRepository,
  ) {}

  async findAll(): Promise<SpaceResponse[]> {
    const entities = await this.spaceRepository.findAll();
    return entities.map(e => SpaceMapper.toResponse(e));
  }

  async findById(id: string): Promise<SpaceResponse> {
    const entity = await this.spaceRepository.findById(id);
    if (!entity) throw new NotFoundException(`Space ${id} not found`);
    return SpaceMapper.toResponse(entity);
  }

  async findBySlug(slug: string): Promise<SpaceResponse> {
    const entity = await this.spaceRepository.findBySlug(slug);
    if (!entity) throw new NotFoundException(`Space ${slug} not found`);
    return SpaceMapper.toResponse(entity);
  }
}
