import { OrderStatus } from '@prisma/client';

import { UserResponse } from '@/modules/identity/application/dto/responses';

import { OrderItem } from './order-item.entity';

export class SubOrder {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public status: OrderStatus,
    public readonly supplierId: string,
    public readonly sourceBundleId: string | null,
    public readonly items: OrderItem[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly supplier?: UserResponse,
    public readonly buyer?: UserResponse,
  ) {}
}
