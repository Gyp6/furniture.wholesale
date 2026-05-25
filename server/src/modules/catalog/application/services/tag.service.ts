import { type ITagRepository, TAG_REPOSITORY } from '@catalog/domain/contracts';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { TagResponse } from '../dto/responses';
import { TagMapper } from '../mappers';

@Injectable()
export class TagService {
  constructor(
    @Inject(TAG_REPOSITORY)
    private readonly tagRepository: ITagRepository,
  ) {}

  async findAll(): Promise<TagResponse[]> {
    const entities = await this.tagRepository.findAll();
    return entities.map(e => TagMapper.toResponse(e));
  }

  async findById(id: string): Promise<TagResponse> {
    const entity = await this.tagRepository.findById(id);
    if (!entity) throw new NotFoundException(`Tag ${id} not found`);
    return TagMapper.toResponse(entity);
  }

  async findBySlug(slug: string): Promise<TagResponse> {
    const entity = await this.tagRepository.findBySlug(slug);
    if (!entity) throw new NotFoundException(`Tag ${slug} not found`);
    return TagMapper.toResponse(entity);
  }
}
