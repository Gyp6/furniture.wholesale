import { Product } from '@/modules/catalog/domain/entities/product.entity';

export class OrderItem {
  constructor(
    public readonly id: string,
    public readonly subOrderId: string,
    public readonly productId: string,
    public readonly quantity: number,
    public readonly priceSnapshot: number,
    public readonly titleSnapshot: string,
    public readonly skuSnapshot: string,
    public readonly product?: Product,
  ) {}
}
