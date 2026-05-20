import { DimensionMapper } from '@catalog/application/mappers';
import { IDimensionRepository } from '@catalog/domain/contracts';
import { Dimension } from '@catalog/domain/entities';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/infrastructure/prisma/prisma.service';

@Injectable()
export class DimensionRepository implements IDimensionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Dimension[]> {
    const raws = await this.prisma.dimension.findMany();
    return raws.map(raw => DimensionMapper.toDomain(raw));
  }
}
