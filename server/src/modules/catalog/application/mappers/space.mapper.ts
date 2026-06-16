import { Space } from '@catalog/domain/entities';

import { SpaceResponse } from '../dto/responses';

export class SpaceMapper {
  static toDomain(raw: Space): Space {
    return new Space(raw.id, raw.title, raw.slug);
  }
  static toResponse(entity: Space): SpaceResponse {
    return {
      id: entity.id,
      title: entity.title,
      slug: entity.slug,
    };
  }
  static toResponseClear(entity: Space): Omit<SpaceResponse, 'id'> {
    return {
      title: entity.title,
      slug: entity.slug,
    };
  }
}
