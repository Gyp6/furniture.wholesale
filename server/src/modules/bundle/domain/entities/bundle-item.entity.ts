import { BundleItemTargetConflictError } from '@bundle/domain/exceptions';

export class BundleItem {
  constructor(
    public readonly id: string,
    public readonly bundleId: string,
    public readonly productId: string | null,
    public readonly nestedBundleId: string | null,
    public readonly quantity: number,
    public readonly priceSnapshot: number,
    public readonly createdAt: Date,
  ) {
    const hasProduct = productId !== null;
    const hasNested = nestedBundleId !== null;
    if (hasProduct === hasNested) {
      throw new BundleItemTargetConflictError();
    }
  }

  get isProduct(): boolean {
    return this.productId !== null;
  }

  get isNestedBundle(): boolean {
    return this.nestedBundleId !== null;
  }
}
