import { CategoryMapper } from '@catalog/application/mappers';
import { ICategoryRepository } from '@catalog/domain/contracts';
import { Category } from '@catalog/domain/entities';
import { Injectable } from '@nestjs/common';

import { PrismaService } from '@/infrastructure/prisma/prisma.service';

@Injectable()
export class CategoryRepository implements ICategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Category[]> {
    const raws = await this.prisma.category.findMany();
    return raws.map(raw => CategoryMapper.toDomain(raw));
  }

  async findById(id: string): Promise<Category | null> {
    const raw = await this.prisma.category.findUnique({ where: { id } });
    return raw ? CategoryMapper.toDomain(raw) : null;
  }

  async create(name: string): Promise<Category> {
    const raw = await this.prisma.category.create({ data: { name } });
    return CategoryMapper.toDomain(raw);
  }
}
