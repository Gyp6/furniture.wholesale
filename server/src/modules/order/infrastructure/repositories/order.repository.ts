import { Injectable } from '@nestjs/common';
import { OrderStatus, Prisma, Order as PrismaOrder, SubOrder as PrismaSubOrder } from '@prisma/client';
import { IOrderRepository } from '@order/domain/contracts';
import { Order, SubOrder } from '@order/domain/entities';
import { OrderMapper } from '@order/application/mappers/order.mapper';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';

@Injectable()
export class OrderRepository implements IOrderRepository {
  private readonly orderInclude = {
    buyer: {
      include: {
        profile: {
          include: {
            company: true,
          },
        },
      },
    },
    subOrders: {
      include: {
        supplier: {
          include: {
            profile: {
              include: {
                company: true,
              },
            },
          },
        },
        items: {
          include: {
            product: {
              include: {
                manufacturer: true,
                supplier: true,
                category: true,
                dimension: true,
                spaces: { include: { spaceType: true } },
                tags: { include: { tag: true } },
              },
            },
          },
        },
      },
    },
  } as const satisfies Prisma.OrderInclude;

  private readonly subOrderInclude = {
    order: {
      include: {
        buyer: {
          include: {
            profile: {
              include: {
                company: true,
              },
            },
          },
        },
      },
    },
    supplier: {
      include: {
        profile: {
          include: {
            company: true,
          },
        },
      },
    },
    items: {
      include: {
        product: {
          include: {
            manufacturer: true,
            supplier: true,
            category: true,
            dimension: true,
            spaces: { include: { spaceType: true } },
            tags: { include: { tag: true } },
          },
        },
      },
    },
  } as const satisfies Prisma.SubOrderInclude;

  constructor(private readonly prisma: PrismaService) {}

  async create(order: Order): Promise<Order> {
    const raw = await this.prisma.order.create({
      data: {
        id: order.id,
        buyerId: order.buyerId,
        status: order.status,
        totalAmount: new Prisma.Decimal(order.totalAmount),
        platformFee: new Prisma.Decimal(order.platformFee),
        subOrders: {
          create: order.subOrders.map(sub => ({
            id: sub.id,
            status: sub.status,
            supplierId: sub.supplierId,
            sourceBundleId: sub.sourceBundleId,
            items: {
              create: sub.items.map(item => ({
                id: item.id,
                productId: item.productId,
                quantity: item.quantity,
                priceSnapshot: new Prisma.Decimal(item.priceSnapshot),
                titleSnapshot: item.titleSnapshot,
                skuSnapshot: item.skuSnapshot,
              })),
            },
          })),
        },
      },
      include: this.orderInclude,
    });
    return OrderMapper.toDomain(raw);
  }

  async findById(id: string): Promise<Order | null> {
    const raw = await this.prisma.order.findUnique({
      where: { id },
      include: this.orderInclude,
    });
    return raw ? OrderMapper.toDomain(raw) : null;
  }

  async findSubOrderById(id: string): Promise<SubOrder | null> {
    const raw = await this.prisma.subOrder.findUnique({
      where: { id },
      include: this.subOrderInclude,
    });
    return raw ? OrderMapper.toDomain({
      id: raw.orderId,
      buyerId: raw.order?.buyerId ?? '',
      status: raw.status,
      totalAmount: 0,
      platformFee: 0,
      buyer: raw.order?.buyer,
      subOrders: [raw as any],
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    } as any).subOrders[0] : null;
  }

  async findAllByBuyerId(buyerId: string): Promise<Order[]> {
    const raws = await this.prisma.order.findMany({
      where: { buyerId },
      include: this.orderInclude,
      orderBy: { createdAt: 'desc' },
    });
    return raws.map(r => OrderMapper.toDomain(r));
  }

  async findAllBySupplierId(supplierId: string): Promise<SubOrder[]> {
    const raws = await this.prisma.subOrder.findMany({
      where: { supplierId },
      include: this.subOrderInclude,
      orderBy: { createdAt: 'desc' },
    });
    return raws.map(raw => OrderMapper.toDomain({
      id: raw.orderId,
      buyerId: raw.order?.buyerId ?? '',
      status: raw.status,
      totalAmount: 0,
      platformFee: 0,
      buyer: raw.order?.buyer,
      subOrders: [raw as any],
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    } as any).subOrders[0]);
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    const raw = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: this.orderInclude,
    });
    return OrderMapper.toDomain(raw);
  }

  async updateSubOrderStatus(id: string, status: OrderStatus): Promise<SubOrder> {
    const raw = await this.prisma.subOrder.update({
      where: { id },
      data: { status },
      include: this.subOrderInclude,
    });
    return OrderMapper.toDomain({
      id: raw.orderId,
      buyerId: raw.order?.buyerId ?? '',
      status: raw.status,
      totalAmount: 0,
      platformFee: 0,
      buyer: raw.order?.buyer,
      subOrders: [raw as any],
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    } as any).subOrders[0];
  }

  async findRawOrder(id: string): Promise<PrismaOrder | null> {
    return await this.prisma.order.findUnique({ where: { id } });
  }

  async findRawSubOrder(id: string): Promise<PrismaSubOrder | null> {
    return await this.prisma.subOrder.findUnique({ where: { id } });
  }
}
