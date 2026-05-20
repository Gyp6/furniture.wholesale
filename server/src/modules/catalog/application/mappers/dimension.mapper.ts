import { Dimension } from '@catalog/domain/entities';

import { DimensionResponse } from '../dto/responses';

export class DimensionMapper {
  static toDomain(raw: Dimension): Dimension {
    return new Dimension(raw.id, raw.width, raw.height, raw.depth);
  }
  static toResponse(entity: Dimension): DimensionResponse {
    return {
      id: entity.id,
      width: entity.width,
      height: entity.height,
      depth: entity.depth,
    };
  }
  static toResponseClear(entity: Dimension): Omit<DimensionResponse, 'id'> {
    return {
      width: entity.width,
      height: entity.height,
      depth: entity.depth,
    };
  }
}
