import { CreateProductRequest } from '@catalog/application/dto/requests';
import { ProductMapper } from '@catalog/application/mappers';
import { IProductRepository } from '@catalog/domain/contracts';
import { Product } from '@catalog/domain/entities';
import { Injectable } from '@nestjs/common';
import { Prisma, Product as PrismaProduct } from '@prisma/client';

import { PRODUCT_STATUSES } from '@/common/constants';
import { TProductStatusValues } from '@/common/types';
import { generateSlug } from '@/core/lib';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';

@Injectable()
export class ProductRepository implements IProductRepository {
  private readonly include = {
    vendor: { select: { id: true, name: true } },
    tags: { include: { tag: true } },
  } as const satisfies Prisma.ProductInclude;

  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Product[]> {
    const raws = await this.prisma.product.findMany({
      where: { status: PRODUCT_STATUSES.ACTIVE },
      include: this.include,
    });

    return raws.map(raw => ProductMapper.toDomain(raw));
  }

  async findRaw(id: string): Promise<PrismaProduct | null> {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async findOne(id: string): Promise<Product | null> {
    const raw = await this.prisma.product.findUnique({
      where: { id },
      include: this.include,
    });

    return raw ? ProductMapper.toDomain(raw) : null;
  }

  async create(
    supplierId: string,
    vendorId: string,
    dto: CreateProductRequest,
  ): Promise<Product> {
    const { tags, ...rest } = dto;
    const raw = await this.prisma.product.create({
      data: {
        ...rest,
        supplierId,
        vendorId,
        tags: {
          create: await this.buildTagConnections(tags),
        },
      },
      include: this.include,
    });

    return ProductMapper.toDomain(raw);
  }

  async update(
    id: string,
    dto: Partial<CreateProductRequest>,
  ): Promise<Product> {
    const { tags, ...rest } = dto;
    const raw = await this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        ...(tags && {
          tags: {
            deleteMany: {},
            create: await this.buildTagConnections(tags),
          },
        }),
      },
      include: this.include,
    });
    return ProductMapper.toDomain(raw);
  }

  async updateStatus(
    id: string,
    status: TProductStatusValues,
  ): Promise<Product> {
    const raw = await this.prisma.product.update({
      where: { id },
      data: { status },
      include: this.include,
    });
    return ProductMapper.toDomain(raw);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.product.delete({ where: { id } });
  }

  private async buildTagConnections(tagTitles: string[]) {
    return Promise.all(
      tagTitles.map(async title => {
        const slug = generateSlug(title);

        const tag = await this.prisma.productTag.upsert({
          where: { slug },
          update: {},
          create: { title, slug },
        });

        return { tag: { connect: { id: tag.id } } };
      }),
    );
  }
}
