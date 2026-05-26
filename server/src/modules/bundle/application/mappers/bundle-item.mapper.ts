import { BundleItem } from '@bundle/domain/entities';

import { BundleItemResponse } from '../dto/responses';

export class BundleItemMapper {
  static toResponse(item: BundleItem): BundleItemResponse {
    return {
      id: item.id,
      productId: item.productId,
      nestedBundleId: item.nestedBundleId,
      quantity: item.quantity,
      priceSnapshot: item.priceSnapshot,
      createdAt: item.createdAt,
    };
  }
}
