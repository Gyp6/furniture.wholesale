import type { TSpaceTypeValues } from '@/common/types';
import {
  IsCategoryId,
  IsImages,
  IsMinSellQuantity,
  IsPrice,
  IsProductTags,
  IsSpaceType,
  IsTitle,
} from '@/common/validators';

export class CreateProductRequest {
  @IsTitle()
  title!: string;

  @IsImages()
  images!: string[];

  @IsPrice()
  price!: number;

  @IsMinSellQuantity()
  minSellQuantity?: number;

  @IsCategoryId()
  categoryId!: string;

  @IsProductTags()
  tags!: string[];

  @IsSpaceType()
  spaceType!: TSpaceTypeValues;
}
