import { ApiProperty } from '@nestjs/swagger';

export class PriceListItemResponse {
  @ApiProperty() id!: string;
  @ApiProperty() sku!: string;
  @ApiProperty() title!: string;
  @ApiProperty({ description: 'Base wholesale price, USD' }) priceUsd!: number;
  @ApiProperty({ description: 'Price in the response currency' }) price!: number;
}

export class PriceListResponse {
  @ApiProperty({ example: 'UAH' }) currency!: string;
  @ApiProperty({ nullable: true, description: 'UAH per 1 USD' })
  rate!: number | null;
  @ApiProperty({ nullable: true }) rateDate!: string | null;
  @ApiProperty({ enum: ['live', 'stale-cache', 'unavailable'] })
  rateSource!: 'live' | 'stale-cache' | 'unavailable';
  @ApiProperty({ description: 'true when the FX dependency failed and a fallback was used' })
  degraded!: boolean;
  @ApiProperty({ type: [PriceListItemResponse] }) items!: PriceListItemResponse[];
}
