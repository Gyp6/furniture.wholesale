import { Order, SubOrder } from '@order/domain/entities';
import { OrderStatus, Order as PrismaOrder, SubOrder as PrismaSubOrder } from '@prisma/client';

export const ORDER_REPOSITORY: unique symbol = Symbol('ORDER_REPOSITORY');
export type ORDER_REPOSITORY = typeof ORDER_REPOSITORY;

export interface IOrderRepository {
  create(order: Order): Promise<Order>;
  findById(id: string): Promise<Order | null>;
  findSubOrderById(id: string): Promise<SubOrder | null>;
  findAllByBuyerId(buyerId: string): Promise<Order[]>;
  findAllBySupplierId(supplierId: string): Promise<SubOrder[]>;
  updateStatus(id: string, status: OrderStatus): Promise<Order>;
  updateSubOrderStatus(id: string, status: OrderStatus): Promise<SubOrder>;
  findRawOrder(id: string): Promise<PrismaOrder | null>;
  findRawSubOrder(id: string): Promise<PrismaSubOrder | null>;
}
