import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';

import { PRODUCT_STATUSES } from '@/common/constants';
import type { TProductStatusValues } from '@/common/types';

import { CreateProductRequest } from './create-product.request';

export class UpdateProductRequest extends PartialType(CreateProductRequest) {}

export class UpdateProductStatusRequest {
  @ApiProperty({
    enum: PRODUCT_STATUSES,
    example: PRODUCT_STATUSES.ACTIVE,
  })
  @IsEnum(PRODUCT_STATUSES, { message: 'Invalid product status' })
  status!: TProductStatusValues;
}
