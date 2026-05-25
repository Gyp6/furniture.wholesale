import {
  CATEGORY_REPOSITORY,
  type ICategoryRepository,
} from '@catalog/domain/contracts';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';

import { CategoryResponse } from '../dto/responses';
import { CategoryMapper } from '../mappers';

@Injectable()
export class CategoryService {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly categoryRepository: ICategoryRepository,
  ) {}

  async findAll(): Promise<CategoryResponse[]> {
    const entities = await this.categoryRepository.findAll();
    return entities.map(e => CategoryMapper.toResponse(e));
  }

  async findById(id: string): Promise<CategoryResponse> {
    const entity = await this.categoryRepository.findById(id);
    if (!entity) throw new NotFoundException(`Category ${id} not found`);
    return CategoryMapper.toResponse(entity);
  }

  async findBySlug(slug: string): Promise<CategoryResponse> {
    const entity = await this.categoryRepository.findBySlug(slug);
    if (!entity) throw new NotFoundException(`Category ${slug} not found`);
    return CategoryMapper.toResponse(entity);
  }

  async create(name: string): Promise<CategoryResponse> {
    const entity = await this.categoryRepository.create(name);
    return CategoryMapper.toResponse(entity);
  }
}
