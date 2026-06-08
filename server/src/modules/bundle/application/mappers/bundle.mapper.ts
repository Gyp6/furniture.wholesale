import { Bundle, BundleItem } from '@bundle/domain/entities';
import { Prisma } from '@prisma/client';

import {
  ProductMapper,
  SpaceMapper,
} from '@/modules/catalog/application/mappers';

import { BundleResponse } from '../dto/responses';

import { BundleItemMapper } from './bundle-item.mapper';

export type PrismaBundleWithItems = Prisma.BundleGetPayload<{
  include: {
    spaceType: true;
    items: {
      include: {
        product: {
          include: {
            manufacturer: true;
            supplier: true;
            category: true;
            dimension: true;
            spaces: { include: { spaceType: true } };
            tags: { include: { tag: true } };
          };
        };
        nestedBundle: {
          include: {
            spaceType: true;
            items: {
              include: {
                product: {
                  include: {
                    manufacturer: true;
                    supplier: true;
                    category: true;
                    dimension: true;
                    spaces: { include: { spaceType: true } };
                    tags: { include: { tag: true } };
                  };
                };
              };
            };
          };
        };
      };
    };
  };
}>;

export class BundleMapper {
  static toDomain(raw: PrismaBundleWithItems): Bundle {
    const domainItems = raw.items.map(item => {
      const domainProduct = item.product
        ? ProductMapper.toDomain(item.product)
        : null;
      const domainNestedBundle = item.nestedBundle
        ? BundleMapper.toDomain(item.nestedBundle as any)
        : null;

      return new BundleItem(
        item.id,
        item.bundleId,
        item.productId,
        item.nestedBundleId,
        item.quantity,
        Number(item.priceSnapshot),
        item.createdAt,
        domainProduct,
        domainNestedBundle,
      );
    });

    return new Bundle(
      raw.id,
      raw.bundleType,
      raw.depth,
      raw.userId,
      raw.spaceTypeId,
      raw.parentBundleId,
      domainItems,
      raw.createdAt,
      raw.updatedAt,
      raw.name,
      raw.description,
      raw.status,
      raw.isShared,
      raw.shareToken,
      SpaceMapper.toDomain(raw.spaceType),
    );
  }

  static toResponse(entity: Bundle, baseUrl: string): BundleResponse {
    const totalPrice = entity.items.reduce(
      (sum, item) => sum + item.priceSnapshot * item.quantity,
      0,
    );

    return {
      id: entity.id,
      bundleType: entity.bundleType,
      depth: entity.depth,
      userId: entity.userId,
      name: entity.name,
      description: entity.description,
      status: entity.status,
      isShared: entity.isShared,
      shareToken: entity.shareToken,
      shareUrl: entity.shareToken
        ? `${baseUrl}/bundles/share/${entity.shareToken}`
        : null,
      space: SpaceMapper.toResponse(entity.space),
      parentBundleId: entity.parentBundleId,
      items: entity.items.map(i => BundleItemMapper.toResponse(i, baseUrl)),
      totalPrice,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
