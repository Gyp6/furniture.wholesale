import { CategoryMapper } from '@catalog/application/mappers';
import { ICategoryRepository } from '@catalog/domain/contracts';
import { Category } from '@catalog/domain/entities';
import { Injectable } from '@nestjs/common';

import { generateSlug } from '@/core/lib';
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

  async create(title: string): Promise<Category> {
    const raw = await this.prisma.category.create({
      data: { title, slug: this.buildSlug(title) },
    });
    return CategoryMapper.toDomain(raw);
  }

  private buildSlug(title: string) {
    return generateSlug(title);
  }
}
