import { OmitType } from '@nestjs/mapped-types';

import { DimensionRequest } from '@/common/dto/requests';
import type { TSpaceTypeValues } from '@/common/types';
import {
  IsDate,
  IsDescription,
  IsEmbedded,
  IsHash,
  IsImages,
  IsMinSellUnits,
  IsPrice,
  IsSku,
  IsSpaceType,
  IsStock,
  IsTitle,
} from '@/common/validators';

import { ManufacturerResponse } from './manufacturer.response';
import { TagResponse } from './tag.response';

export class ProductTagResponse extends OmitType(TagResponse, [
  'id',
] as const) {}

export class ProductResponse {
  @IsHash({ title: 'id' })
  id!: string;

  @IsSku()
  sku!: string;

  @IsTitle()
  title!: string;

  @IsDescription()
  description!: string | null;

  @IsPrice()
  price!: number;

  @IsStock()
  stock!: number;

  @IsImages()
  images!: string[];

  @IsMinSellUnits()
  minSellUnits!: number | null;

  @IsSpaceType()
  spaceType!: TSpaceTypeValues;

  @IsEmbedded({ to: DimensionRequest })
  dimension!: DimensionRequest;

  @IsEmbedded({ to: ManufacturerResponse })
  manufacturer!: ManufacturerResponse;

  @IsEmbedded({ to: ProductTagResponse })
  tags!: ProductTagResponse[];

  @IsDate()
  createdAt!: Date;
}
