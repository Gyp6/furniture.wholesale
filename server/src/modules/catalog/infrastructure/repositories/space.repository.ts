import { SpaceMapper } from '@catalog/application/mappers';
import { ISpaceRepository } from '@catalog/domain/contracts';
import { Space } from '@catalog/domain/entities';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/infrastructure/prisma/prisma.service';

@Injectable()
export class SpaceRepository implements ISpaceRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Space[]> {
    const raws = await this.prisma.spaceType.findMany();
    return raws.map(raw => SpaceMapper.toDomain(raw));
  }

  async findById(id: string): Promise<Space | null> {
    const raw = await this.prisma.spaceType.findUnique({ where: { id } });
    return raw ? SpaceMapper.toDomain(raw) : null;
  }

  async findBySlug(slug: string): Promise<Space | null> {
    const raw = await this.prisma.spaceType.findUnique({ where: { slug } });
    return raw ? SpaceMapper.toDomain(raw) : null;
  }
}
