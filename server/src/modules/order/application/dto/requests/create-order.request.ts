import { Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

export class CreateOrderItemRequest {
  @IsString()
  @IsOptional()
  productId?: string;

  @IsString()
  @IsOptional()
  bundleId?: string;

  @IsNumber()
  quantity!: number;

  @IsNumber()
  priceSnapshot!: number;
}

export class CreateOrderRequest {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemRequest)
  items!: CreateOrderItemRequest[];
}
