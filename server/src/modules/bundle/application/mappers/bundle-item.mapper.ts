import { BundleItem } from '@bundle/domain/entities';

import { ProductMapper } from '@/modules/catalog/application/mappers';

import { BundleItemResponse } from '../dto/responses';

import { BundleMapper } from './bundle.mapper';

export class BundleItemMapper {
  static toResponse(item: BundleItem, baseUrl: string): BundleItemResponse {
    return {
      id: item.id,
      product: item.product
        ? ProductMapper.toResponse(item.product, baseUrl)
        : null,
      nestedBundle: item.nestedBundle
        ? BundleMapper.toResponse(item.nestedBundle, baseUrl)
        : null,
      quantity: item.quantity,
      priceSnapshot: item.priceSnapshot,
      createdAt: item.createdAt,
    };
  }
}
