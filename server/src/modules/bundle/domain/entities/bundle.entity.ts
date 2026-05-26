import {
  BundleNestingDepthError,
  CannotForkSupplierBundleError,
  SupplierBundleCannotNestError,
} from '@bundle/domain/exceptions';
import { nanoid } from 'nanoid';

import { BUNDLE_TYPES, PRODUCT_STATUSES } from '@/common/constants';
import type { TBundleTypeValues, TProductStatusValues } from '@/common/types';

import { BundleItem } from './bundle-item.entity';

export class Bundle {
  constructor(
    public readonly id: string,
    public readonly bundleType: TBundleTypeValues,
    public readonly depth: number,
    public readonly userId: string,
    public readonly spaceTypeId: string,
    public readonly parentBundleId: string | null,
    public readonly items: BundleItem[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public name: string,
    public description: string | null,
    public status: TProductStatusValues,
    public isShared: boolean,
    public shareToken: string | null,
  ) {}

  get isSupplierBundle(): boolean {
    return this.bundleType === BUNDLE_TYPES.SUPPLIER;
  }

  get isUserBundle(): boolean {
    return this.bundleType === BUNDLE_TYPES.USER;
  }

  validateCanNest(nested: Bundle): void {
    if (this.isSupplierBundle) {
      throw new SupplierBundleCannotNestError();
    }
    if (nested.isUserBundle) {
      throw new BundleNestingDepthError();
    }
  }

  fork(newOwnerId: string): Bundle {
    if (this.isSupplierBundle) {
      throw new CannotForkSupplierBundleError();
    }

    const newBundleId = nanoid();
    const forkedItems = this.items.map(
      item =>
        new BundleItem(
          nanoid(),
          newBundleId,
          item.productId,
          item.nestedBundleId,
          item.quantity,
          item.priceSnapshot,
          new Date(),
        ),
    );

    return new Bundle(
      newBundleId,
      BUNDLE_TYPES.USER,
      1,
      newOwnerId,
      this.spaceTypeId,
      this.id,
      forkedItems,
      new Date(),
      new Date(),
      `${this.name} (copy)`,
      this.description,
      PRODUCT_STATUSES.DRAFT,
      false,
      null,
    );
  }

  enableSharing(): string {
    const token = nanoid();
    this.isShared = true;
    this.shareToken = token;
    return token;
  }

  disableSharing(): void {
    this.isShared = false;
    this.shareToken = null;
  }
}
