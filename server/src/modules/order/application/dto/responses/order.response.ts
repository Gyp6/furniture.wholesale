import { OrderStatus } from '@prisma/client';
import { UserResponse } from '@/modules/identity/application/dto/responses';
import { ProductResponse } from '@catalog/application/dto/responses';

export class OrderItemResponse {
  id!: string;
  productId!: string;
  quantity!: number;
  priceSnapshot!: number;
  titleSnapshot!: string;
  skuSnapshot!: string;
  product?: ProductResponse | null;
}

export class SubOrderResponse {
  id!: string;
  orderId!: string;
  status!: OrderStatus;
  supplierId!: string;
  sourceBundleId!: string | null;
  items!: OrderItemResponse[];
  createdAt!: Date;
  updatedAt!: Date;
  supplier?: UserResponse | null;
  buyer?: UserResponse | null;
}

export class OrderResponse {
  id!: string;
  buyerId!: string;
  status!: OrderStatus;
  totalAmount!: number;
  platformFee!: number;
  subOrders!: SubOrderResponse[];
  createdAt!: Date;
  updatedAt!: Date;
  buyer?: UserResponse | null;
}
