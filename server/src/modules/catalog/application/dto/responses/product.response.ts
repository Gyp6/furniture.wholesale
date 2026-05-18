import { ApiProperty } from '@nestjs/swagger';

import type { TSpaceTypeValues } from '@/common/types';
import {
  IsCategoryId,
  IsHash,
  IsImages,
  IsMinSellQuantity,
  IsPrice,
  IsSlug,
  IsSpaceType,
  IsTitle,
  IsVendor,
} from '@/common/validators';

export class ProductTagResponse {
  @IsTitle()
  title!: string;

  @IsSlug()
  slug!: string;
}

export class ProductResponse {
  @IsHash({ title: 'id' })
  id!: string;

  @IsTitle()
  title!: string;

  @IsImages()
  images!: string[];

  @IsPrice()
  price!: number;

  @IsMinSellQuantity()
  minSellQuantity!: number | null;

  @IsCategoryId()
  categoryId!: string;

  @IsVendor()
  vendor!: string;

  @ApiProperty({
    type: () => [ProductTagResponse],
    description: 'Product tags',
  })
  tags!: ProductTagResponse[];

  @IsSpaceType()
  spaceType!: TSpaceTypeValues;
}
