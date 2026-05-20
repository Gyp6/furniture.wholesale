import { DimensionRequest } from '@/common/dto/requests';
import type { TSpaceTypeValues } from '@/common/types';
import {
  IsCategoryId,
  IsEmbedded,
  IsImages,
  IsMinSellUnits,
  IsPrice,
  IsProductTags,
  IsSpaceType,
  IsStock,
  IsTitle,
} from '@/common/validators';

export class CreateProductRequest {
  @IsTitle()
  title!: string;

  @IsImages()
  images!: string[];

  @IsPrice()
  price!: number;

  @IsStock()
  stock!: number;

  @IsMinSellUnits()
  minSellUnits!: number;

  @IsCategoryId()
  categoryId!: string;

  @IsEmbedded({ to: DimensionRequest })
  dimension!: DimensionRequest;

  @IsProductTags()
  tags!: string[];

  @IsSpaceType()
  spaceType!: TSpaceTypeValues;
}
