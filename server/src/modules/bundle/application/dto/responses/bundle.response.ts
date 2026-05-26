import { BundleType, ProductStatus } from '@prisma/client';

export class BundleItemResponse {
  id!: string;
  quantity!: number;
  priceSnapshot!: number;
  createdAt!: Date;

  productId!: string | null;
  nestedBundleId!: string | null;
}

export class BundleResponse {
  id!: string;
  bundleType!: BundleType;
  depth!: number;
  userId!: string;

  name!: string;
  description!: string | null;
  status!: ProductStatus;

  isShared!: boolean;
  shareToken!: string | null;
  shareUrl!: string | null;

  spaceTypeId!: string;
  parentBundleId!: string | null;

  items!: BundleItemResponse[];

  totalPrice!: number;

  createdAt!: Date;
  updatedAt!: Date;
}
