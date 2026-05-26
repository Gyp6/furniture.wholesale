import { BundleItemTargetConflictError } from '@bundle/domain/exceptions';
import { Product } from '@catalog/domain/entities';
import { BadRequestException } from '@nestjs/common';

import { Bundle } from './bundle.entity';

export class BundleItem {
  constructor(
    public readonly id: string,
    public readonly bundleId: string,
    public readonly productId: string | null,
    public readonly nestedBundleId: string | null,
    public readonly quantity: number,
    public readonly priceSnapshot: number,
    public readonly createdAt: Date,

    public readonly product: Product | null = null,
    public readonly nestedBundle: Bundle | null = null,
  ) {
    const hasProduct = productId !== null;
    const hasNested = nestedBundleId !== null;
    if (hasProduct === hasNested) {
      throw new BundleItemTargetConflictError();
    }

    if (hasProduct && !product) {
      throw new BadRequestException(
        'Product cannot be null if BundleItem targets a product.',
      );
    }
    if (hasNested && !nestedBundle) {
      throw new BadRequestException(
        'NestedBundle cannot be null if BundleItem targets a bundle.',
      );
    }
  }

  get isProduct(): boolean {
    return this.productId !== null;
  }

  get isNestedBundle(): boolean {
    return this.nestedBundleId !== null;
  }
}
