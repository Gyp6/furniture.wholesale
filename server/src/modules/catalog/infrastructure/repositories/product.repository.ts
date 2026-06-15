import {
  CreateProductRequest,
  CreateSkuRequest,
} from '@catalog/application/dto/requests';
import { ProductMapper } from '@catalog/application/mappers';
import { IProductRepository } from '@catalog/domain/contracts';
import { Product } from '@catalog/domain/entities';
import { Injectable } from '@nestjs/common';
import { Prisma, Product as PrismaProduct } from '@prisma/client';

import { PRODUCT_STATUSES } from '@/common/constants';
import { TProductStatusValues } from '@/common/types';
import { generateSlug } from '@/core/lib';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { SmartSkuService } from '@/infrastructure/smart-sku/smart-sku.service';

@Injectable()
export class ProductRepository implements IProductRepository {
  private readonly include = {
    manufacturer: {
      select: {
        id: true,
        name: true,
        specializations: true,
        verificationStatus: true,
        leadTime: true,
        ratingAvg: true,
      },
    },
    supplier: true,
    category: true,
    dimension: true,
    spaces: { include: { spaceType: true } },
    tags: { include: { tag: true } },
  } as const satisfies Prisma.ProductInclude;

  constructor(
    private readonly prisma: PrismaService,
    private readonly smartSkuService: SmartSkuService,
  ) {}

  async findAll(): Promise<Product[]> {
    const raws = await this.prisma.product.findMany({
      where: { status: PRODUCT_STATUSES.ACTIVE },
      include: this.include,
    });

    return raws.map(raw => ProductMapper.toDomain(raw));
  }

  async findBySupplier(supplierId: string): Promise<Product[]> {
    const raws = await this.prisma.product.findMany({
      where: { supplierId },
      include: this.include,
      orderBy: { createdAt: 'desc' },
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

  async countBySupplierId(
    supplierId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<number> {
    const client = tx ?? this.prisma;
    return client.product.count({
      where: { supplierId },
    });
  }

  async create(
    supplierId: string,
    manufacturerId: string,
    skuDto: Omit<CreateSkuRequest, 'sequence'>,
    dto: CreateProductRequest,
  ): Promise<Product> {
    const { tags, spaces, dimension, images, ...rest } = dto;
    const raw = await this.prisma.$transaction(async tx => {
      const currentCount = await this.countBySupplierId(supplierId, tx);
      const nextSequence = currentCount + 1;

      const newDimension = await tx.dimension.create({
        data: {
          width: dimension.width,
          height: dimension.height,
          depth: dimension.depth,
        },
      });

      return tx.product.create({
        data: {
          ...rest,
          imagesCount: images.length,
          sku: this.smartSkuService.generate({
            ...skuDto,
            sequence: nextSequence,
          }),
          supplierId,
          manufacturerId,
          dimensionId: newDimension.id,
          spaces: {
            create: await this.buildSpaceConnections(spaces, tx),
          },
          tags: {
            create: await this.buildTagConnections(tags, tx),
          },
        },
        include: this.include,
      });
    });

    return ProductMapper.toDomain(raw);
  }

  async update(
    id: string,
    dto: Partial<CreateProductRequest>,
  ): Promise<Product> {
    const { tags, spaces, dimension, categoryId, images, ...rest } = dto;
    const raw = await this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        ...(images && { imagesCount: images.length }),
        ...(categoryId && {
          category: {
            connect: { id: categoryId },
          },
        }),
        ...(dimension && {
          dimension: {
            update: {
              width: dimension.width,
              height: dimension.height,
              depth: dimension.depth,
            },
          },
        }),
        ...(spaces && {
          spaces: {
            deleteMany: {},
            create: await this.buildSpaceConnections(spaces),
          },
        }),
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

  private async buildSpaceConnections(
    spaceTitles: string[],
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return Promise.all(
      spaceTitles.map(async title => {
        const slug = generateSlug(title);

        const space = await client.spaceType.upsert({
          where: { slug },
          update: {},
          create: { title, slug },
        });

        return { spaceType: { connect: { id: space.id } } };
      }),
    );
  }

  private async buildTagConnections(
    tagTitles: string[],
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prisma;
    return Promise.all(
      tagTitles.map(async title => {
        const slug = generateSlug(title);

        const tag = await client.productTag.upsert({
          where: { slug },
          update: {},
          create: { title, slug },
        });

        return { tag: { connect: { id: tag.id } } };
      }),
    );
  }
}
