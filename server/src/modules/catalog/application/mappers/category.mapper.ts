import { Category } from '@catalog/domain/entities';
import type { Category as PrismaCategory } from '@prisma/client';

import { CategoryResponse } from '../dto/responses';

export class CategoryMapper {
  static toDomain(raw: PrismaCategory): Category {
    return new Category(raw.id, raw.title, raw.slug);
  }

  static toResponse(entity: Category): CategoryResponse {
    return {
      id: entity.id,
      title: entity.title,
      slug: entity.slug,
    };
  }

  static toResponseClear(entity: Category): Omit<CategoryResponse, 'id'> {
    return {
      title: entity.title,
      slug: entity.slug,
    };
  }
}
