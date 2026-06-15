import { ProductResponse } from '@catalog/application/dto/responses';
import { Product } from '@catalog/domain/entities';
import { Prisma } from '@prisma/client';

import { COMPANY_STATUSES } from '@/common/constants/company-status.constant';
import { TRoleValues } from '@/common/types';

import { CategoryMapper } from './category.mapper';
import { DimensionMapper } from './dimension.mapper';
import { SpaceMapper } from './space.mapper';
import { TagMapper } from './tag.mapper';

type PrismaProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    manufacturer: {
      select: {
        id: true;
        name: true;
        specializations: true;
        verificationStatus: true;
        leadTime: true;
        ratingAvg: true;
      };
    };
    supplier: true;
    category: true;
    dimension: true;
    spaces: { include: { spaceType: true } };
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
      Number(raw.price),
      raw.stock,
      raw.minSellUnits,
      raw.imagesCount,
      raw.manufacturer.leadTime,
      raw.status,
      raw.categoryId,
      raw.supplierId,
      raw.manufacturerId,
      raw.dimensionId,
      raw.createdAt,
      raw.updatedAt,
      {
        id: raw.category.id,
        title: raw.category.title,
        slug: raw.category.slug,
      },
      {
        id: raw.supplier.id,
        name: raw.supplier.name,
        email: raw.supplier.email,
        emailVerified: raw.supplier.emailVerified,
        image: raw.supplier.image,
        role: raw.supplier.role as TRoleValues,
        banned: raw.supplier.banned,
      },
      {
        id: raw.manufacturer.id,
        name: raw.manufacturer.name,
        specializations: raw.manufacturer.specializations,
        verificationStatus: String(raw.manufacturer.verificationStatus),
        ratingAvg: Number(raw.manufacturer.ratingAvg),
      },
      {
        id: raw.dimension.id,
        width: raw.dimension.width,
        height: raw.dimension.height,
        depth: raw.dimension.depth,
      },
      raw.spaces && Array.isArray(raw.spaces)
        ? raw.spaces.map(s => ({
            id: s.spaceType.id,
            title: s.spaceType.title,
            slug: s.spaceType.slug,
          }))
        : [],
      raw.tags && Array.isArray(raw.tags)
        ? raw.tags.map(t => ({
            id: t.tag.id,
            title: t.tag.title,
            slug: t.tag.slug,
          }))
        : [],
    );
  }

  static toResponse(entity: Product, s3Url: string): ProductResponse {
    const { verificationStatus, ...manufacturerRest } = entity.manufacturer;

    const isDev = process.env.NODE_ENV === 'development';

    const images = Array.from({ length: entity.imagesCount }).map(
      (_, index) => {
        return isDev
          ? `${s3Url}/catalog/test/${index}.png`
          : `${s3Url}/catalog/product/${entity.sku}/${index}.png`;
      },
    );

    return {
      id: entity.id,
      sku: entity.sku,
      title: entity.title,
      description: entity.description,
      price: entity.price,
      stock: entity.stock,
      images: images,
      minSellUnits: entity.minSellUnits,
      leadTime: entity.leadTime,
      status: entity.status,

      manufacturer: {
        ...manufacturerRest,
        isVerified: verificationStatus === COMPANY_STATUSES.VERIFIED,
      },
      category: CategoryMapper.toResponseClear(entity.category),
      dimension: DimensionMapper.toResponseClear(entity.dimension),
      spaces: entity.spaces.map(s => SpaceMapper.toResponseClear(s)),
      tags: entity.tags.map(t => TagMapper.toResponseClear(t)),
      createdAt: entity.createdAt,
    };
  }

  static toResponseUnauthorized(
    entity: Product,
    s3Url: string,
  ): Omit<
    ProductResponse,
    'sku' | 'price' | 'stock' | 'minSellUnits' | 'createdAt'
  > {
    const { verificationStatus, ...manufacturerRest } = entity.manufacturer;

    const isDev = process.env.NODE_ENV === 'development';

    const images = Array.from({ length: entity.imagesCount }).map(
      (_, index) => {
        return isDev
          ? `${s3Url}/catalog/test/${index}.png`
          : `${s3Url}/catalog/product/${entity.sku}/${index}.png`;
      },
    );

    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      images: images,
      leadTime: entity.leadTime,
      status: entity.status,

      manufacturer: {
        ...manufacturerRest,
        isVerified: verificationStatus === COMPANY_STATUSES.VERIFIED,
      },
      category: CategoryMapper.toResponseClear(entity.category),
      dimension: DimensionMapper.toResponseClear(entity.dimension),
      spaces: entity.spaces.map(s => SpaceMapper.toResponseClear(s)),
      tags: entity.tags.map(t => TagMapper.toResponseClear(t)),
    };
  }
}
