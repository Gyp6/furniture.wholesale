import { ApiProperty } from '@nestjs/swagger';

import type { TSpaceTypeValues } from '@/common/types';
import {
  IsCategoryId,
  IsHash,
  IsImages,
  IsMinSellQuantity,
  IsPrice,
  IsSpaceType,
  IsTitle,
  IsVendor,
} from '@/common/validators';

export class ProductTagResponse {
  @ApiProperty({ example: 'Nordic' })
  title!: string;

  @ApiProperty({ example: 'nordic' })
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
