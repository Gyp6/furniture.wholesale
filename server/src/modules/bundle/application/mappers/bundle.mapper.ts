import { Bundle, BundleItem } from '@bundle/domain/entities';
import { Prisma } from '@prisma/client';

import { BundleResponse } from '../dto/responses';

import { BundleItemMapper } from './bundle-item.mapper';

export type PrismaBundleWithItems = Prisma.BundleGetPayload<{
  include: { items: true };
}>;

export class BundleMapper {
  static toDomain(raw: PrismaBundleWithItems): Bundle {
    const domainItems = raw.items.map(
      item =>
        new BundleItem(
          item.id,
          item.bundleId,
          item.productId,
          item.nestedBundleId,
          item.quantity,
          Number(item.priceSnapshot),
          item.createdAt,
        ),
    );

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
      spaceTypeId: entity.spaceTypeId,
      parentBundleId: entity.parentBundleId,
      items: entity.items.map(i => BundleItemMapper.toResponse(i)),
      totalPrice,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
