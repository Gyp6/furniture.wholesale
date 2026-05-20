import { Tag } from '@catalog/domain/entities';

import { TagResponse } from '../dto/responses';

export class TagMapper {
  static toDomain(raw: Tag): Tag {
    return new Tag(raw.id, raw.title, raw.slug);
  }
  static toResponse(entity: Tag): TagResponse {
    return {
      id: entity.id,
      title: entity.title,
      slug: entity.slug,
    };
  }
  static toResponseClear(entity: Tag): Omit<TagResponse, 'id'> {
    return {
      title: entity.title,
      slug: entity.slug,
    };
  }
}
