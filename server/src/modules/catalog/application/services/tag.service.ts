import { type ITagRepository, TAG_REPOSITORY } from '@catalog/domain/contracts';
import { Inject, Injectable } from '@nestjs/common';

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
}
