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

  async findById(id: string): Promise<Tag | null> {
    const raw = await this.prisma.productTag.findUnique({ where: { id } });
    return raw ? TagMapper.toDomain(raw) : null;
  }

  async findBySlug(slug: string): Promise<Tag | null> {
    const raw = await this.prisma.productTag.findUnique({ where: { slug } });
    return raw ? TagMapper.toDomain(raw) : null;
  }
}
