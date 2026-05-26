import { ProductResponse } from '@catalog/application/dto/responses';
import { BundleType, ProductStatus } from '@prisma/client';

import { IInfoObject } from '@/modules/catalog/domain/entities';

export class BundleItemResponse {
  id!: string;
  quantity!: number;
  priceSnapshot!: number;
  createdAt!: Date;

  product!: ProductResponse | null;
  nestedBundle!: BundleResponse | null;
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

  space!: IInfoObject;
  parentBundleId!: string | null;

  items!: BundleItemResponse[];

  totalPrice!: number;

  createdAt!: Date;
  updatedAt!: Date;
}
