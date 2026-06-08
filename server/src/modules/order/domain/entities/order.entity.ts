import { OrderStatus } from '@prisma/client';
import { UserResponse } from '@/modules/identity/application/dto/responses';
import { SubOrder } from './sub-order.entity';

export class Order {
  constructor(
    public readonly id: string,
    public readonly buyerId: string,
    public status: OrderStatus,
    public readonly totalAmount: number,
    public readonly platformFee: number,
    public readonly subOrders: SubOrder[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly buyer?: UserResponse,
  ) {}
}
