import { Category } from '@catalog/domain/entities';
import type { Category as PrismaCategory } from '@prisma/client';

import { CategoryResponse } from '../dto/responses';

export class CategoryMapper {
  static toDomain(raw: PrismaCategory): Category {
    return new Category(raw.id, raw.name);
  }

  static toResponse(entity: Category): CategoryResponse {
    return {
      id: entity.id,
      name: entity.name,
    };
  }
}
