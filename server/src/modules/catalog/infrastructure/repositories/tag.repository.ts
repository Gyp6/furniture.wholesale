import { TagMapper } from '@catalog/application/mappers';
import { ITagRepository } from '@catalog/domain/contracts';
import { Tag } from '@catalog/domain/entities';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/infrastructure/prisma/prisma.service';

@Injectable()
export class TagRepository implements ITagRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Tag[]> {
    const raws = await this.prisma.productTag.findMany();

    return raws.map(raw => TagMapper.toDomain(raw));
  }
}
