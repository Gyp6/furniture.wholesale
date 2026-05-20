import { ProductResponse } from '@catalog/application/dto/responses';
import { Product } from '@catalog/domain/entities';
import { Prisma } from '@prisma/client';

import { COMPANY_STATUSES } from '@/common/constants/company-status.constant';

import { DimensionMapper } from './dimension.mapper';
import { TagMapper } from './tag.mapper';

type PrismaProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    manufacturer: {
      select: {
        id: true;
        name: true;
        specializations: true;
        verificationStatus: true;
        ratingAvg: true;
      };
    };
    dimension: true;
    tags: { include: { tag: true } };
  };
}>;

export class ProductMapper {
  static toDomain(raw: PrismaProductWithRelations): Product {
    return new Product(
      raw.id,
      raw.sku,
      raw.title,
      raw.description,
      raw.images,
      Number(raw.price),
      raw.stock,
      raw.minSellUnits,
      raw.status,
      raw.spaceType,
      raw.categoryId,
      raw.supplierId,
      raw.manufacturerId,
      raw.dimensionId,
      raw.createdAt,
      raw.updatedAt,
      {
        id: raw.dimension.id,
        width: raw.dimension.width,
        height: raw.dimension.height,
        depth: raw.dimension.depth,
      },
      {
        id: raw.manufacturer.id,
        name: raw.manufacturer.name,
        specializations: raw.manufacturer.specializations,
        verificationStatus: String(raw.manufacturer.verificationStatus),
        ratingAvg: Number(raw.manufacturer.ratingAvg),
      },
      raw.tags && Array.isArray(raw.tags)
        ? raw.tags.map(t => ({
            id: t.tag.id,
            title: t.tag.title,
            slug: t.tag.slug,
          }))
        : [],
    );
  }

  static toResponse(entity: Product): ProductResponse {
    const { verificationStatus, ...manufacturerRest } = entity.manufacturer;
    return {
      id: entity.id,
      sku: entity.sku,
      title: entity.title,
      description: entity.description,
      price: entity.price,
      stock: entity.stock,
      images: entity.images,
      minSellUnits: entity.minSellUnits,
      spaceType: entity.spaceType,

      dimension: DimensionMapper.toResponseClear(entity.dimension),
      manufacturer: {
        ...manufacturerRest,
        isVerified: verificationStatus === COMPANY_STATUSES.VERIFIED,
      },
      tags: entity.tags.map(t => TagMapper.toResponseClear(t)),
      createdAt: entity.createdAt,
    };
  }

  static toResponseUnauthorized(
    entity: Product,
  ): Omit<
    ProductResponse,
    'sku' | 'price' | 'stock' | 'minSellUnits' | 'createdAt'
  > {
    const { verificationStatus, ...manufacturerRest } = entity.manufacturer;
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      images: entity.images,
      spaceType: entity.spaceType,

      dimension: DimensionMapper.toResponseClear(entity.dimension),
      manufacturer: {
        ...manufacturerRest,
        isVerified: verificationStatus === COMPANY_STATUSES.VERIFIED,
      },
      tags: entity.tags.map(t => TagMapper.toResponseClear(t)),
    };
  }
}
