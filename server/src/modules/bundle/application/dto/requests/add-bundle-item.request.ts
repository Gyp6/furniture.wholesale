import { IsOptional } from 'class-validator';

import { IsHash, IsPriceSnapshot, IsQuantity } from '@/common/validators';

export class AddBundleItemRequest {
  @IsHash({ title: 'productId' })
  @IsOptional()
  productId?: string | null;

  @IsHash({ title: 'nestedBundleId' })
  @IsOptional()
  nestedBundleId?: string | null;

  @IsQuantity()
  quantity!: number;

  @IsPriceSnapshot()
  priceSnapshot!: number;
}
