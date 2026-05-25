import { DimensionRequest } from '@/common/dto/requests';
import { ClearInfoOnjectResponse } from '@/common/dto/responses';
import {
  IsDate,
  IsDescription,
  IsEmbedded,
  IsHash,
  IsImages,
  IsLeadTime,
  IsMinSellUnits,
  IsPrice,
  IsSku,
  IsStock,
  IsTitle,
} from '@/common/validators';

import { ManufacturerResponse } from './manufacturer.response';

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

  @IsEmbedded({ to: DimensionRequest })
  dimension!: DimensionRequest;

  @IsEmbedded({ to: ManufacturerResponse })
  manufacturer!: ManufacturerResponse;

  @IsEmbedded({ to: ClearInfoOnjectResponse })
  category!: ClearInfoOnjectResponse;

  @IsEmbedded({ to: ClearInfoOnjectResponse })
  spaces!: ClearInfoOnjectResponse[];

  @IsEmbedded({ to: ClearInfoOnjectResponse })
  tags!: ClearInfoOnjectResponse[];

  @IsLeadTime()
  leadTime!: string | null;

  @IsDate()
  createdAt!: Date;
}
