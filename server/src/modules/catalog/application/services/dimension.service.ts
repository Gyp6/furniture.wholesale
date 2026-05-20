import {
  DIMENSION_REPOSITORY,
  type IDimensionRepository,
} from '@catalog/domain/contracts';
import { Inject, Injectable } from '@nestjs/common';

import { DimensionResponse } from '../dto/responses';
import { DimensionMapper } from '../mappers';

@Injectable()
export class DimensionService {
  constructor(
    @Inject(DIMENSION_REPOSITORY)
    private readonly dimensionRepository: IDimensionRepository,
  ) {}

  async findAll(): Promise<DimensionResponse[]> {
    const entities = await this.dimensionRepository.findAll();
    return entities.map(e => DimensionMapper.toResponse(e));
  }
}
