import { Order, OrderItem, SubOrder } from '@order/domain/entities';
import { Prisma } from '@prisma/client';

import { TRoleValues } from '@/common/types';
import { ProductMapper } from '@/modules/catalog/application/mappers';
import { ProfileMapper } from '@/modules/identity/application/mappers/profile.mapper';

import { OrderResponse, SubOrderResponse } from '../dto/responses';

export type PrismaOrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    buyer: {
      include: {
        profile: {
          include: {
            company: true;
          };
        };
      };
    };
    subOrders: {
      include: {
        supplier: {
          include: {
            profile: {
              include: {
                company: true;
              };
            };
          };
        };
        items: {
          include: {
            product: {
              include: {
                manufacturer: true;
                supplier: true;
                category: true;
                dimension: true;
                spaces: { include: { spaceType: true } };
                tags: { include: { tag: true } };
              };
            };
          };
        };
      };
    };
  };
}>;

export type PrismaSubOrderWithRelations = Prisma.SubOrderGetPayload<{
  include: {
    order: {
      include: {
        buyer: {
          include: {
            profile: {
              include: {
                company: true;
              };
            };
          };
        };
      };
    };
    supplier: {
      include: {
        profile: {
          include: {
            company: true;
          };
        };
      };
    };
    items: {
      include: {
        product: {
          include: {
            manufacturer: true;
            supplier: true;
            category: true;
            dimension: true;
            spaces: { include: { spaceType: true } };
            tags: { include: { tag: true } };
          };
        };
      };
    };
  };
}>;

export class OrderMapper {
  static toDomain(raw: PrismaOrderWithRelations): Order {
    const subOrders = raw.subOrders.map(subRaw => {
      const items = subRaw.items.map(itemRaw => {
        return new OrderItem(
          itemRaw.id,
          itemRaw.subOrderId,
          itemRaw.productId,
          itemRaw.quantity,
          Number(itemRaw.priceSnapshot),
          itemRaw.titleSnapshot,
          itemRaw.skuSnapshot,
          itemRaw.product ? ProductMapper.toDomain(itemRaw.product) : undefined,
        );
      });

      const buyer = (subRaw as any).order?.buyer
        ? {
            id: (subRaw as any).order.buyer.id,
            name: (subRaw as any).order.buyer.name,
            email: (subRaw as any).order.buyer.email,
            emailVerified: (subRaw as any).order.buyer.emailVerified,
            image: (subRaw as any).order.buyer.image,
            role: (subRaw as any).order.buyer.role as TRoleValues,
            profile: (subRaw as any).order.buyer.profile
              ? ProfileMapper.toResponse(
                  ProfileMapper.toDomain((subRaw as any).order.buyer.profile),
                )
              : null,
          }
        : raw.buyer
          ? {
              id: raw.buyer.id,
              name: raw.buyer.name,
              email: raw.buyer.email,
              emailVerified: raw.buyer.emailVerified,
              image: raw.buyer.image,
              role: raw.buyer.role as TRoleValues,
              profile: raw.buyer.profile
                ? ProfileMapper.toResponse(
                    ProfileMapper.toDomain(raw.buyer.profile),
                  )
                : null,
            }
          : undefined;

      return new SubOrder(
        subRaw.id,
        subRaw.orderId,
        subRaw.status,
        subRaw.supplierId,
        subRaw.sourceBundleId,
        items,
        subRaw.createdAt,
        subRaw.updatedAt,
        subRaw.supplier
          ? {
              id: subRaw.supplier.id,
              name: subRaw.supplier.name,
              email: subRaw.supplier.email,
              emailVerified: subRaw.supplier.emailVerified,
              image: subRaw.supplier.image,
              role: subRaw.supplier.role as TRoleValues,
              profile: subRaw.supplier.profile
                ? ProfileMapper.toResponse(
                    ProfileMapper.toDomain(subRaw.supplier.profile),
                  )
                : null,
            }
          : undefined,
        buyer,
      );
    });

    return new Order(
      raw.id,
      raw.buyerId,
      raw.status,
      Number(raw.totalAmount),
      Number(raw.platformFee),
      subOrders,
      raw.createdAt,
      raw.updatedAt,
      raw.buyer
        ? {
            id: raw.buyer.id,
            name: raw.buyer.name,
            email: raw.buyer.email,
            emailVerified: raw.buyer.emailVerified,
            image: raw.buyer.image,
            role: raw.buyer.role as TRoleValues,
            profile: raw.buyer.profile
              ? ProfileMapper.toResponse(
                  ProfileMapper.toDomain(raw.buyer.profile),
                )
              : null,
          }
        : undefined,
      raw.shippingAddress,
    );
  }

  static toResponse(entity: Order, baseUrl: string): OrderResponse {
    return {
      id: entity.id,
      buyerId: entity.buyerId,
      status: entity.status,
      totalAmount: entity.totalAmount,
      platformFee: entity.platformFee,
      shippingAddress: entity.shippingAddress,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      buyer: entity.buyer
        ? {
            id: entity.buyer.id,
            name: entity.buyer.name,
            email: entity.buyer.email,
            emailVerified: entity.buyer.emailVerified,
            image: entity.buyer.image,
            role: entity.buyer.role,
            profile: entity.buyer.profile,
          }
        : null,
      subOrders: entity.subOrders.map(sub =>
        this.subOrderToResponse(sub, baseUrl),
      ),
    };
  }

  static subOrderToResponse(
    entity: SubOrder,
    baseUrl: string,
  ): SubOrderResponse {
    return {
      id: entity.id,
      orderId: entity.orderId,
      status: entity.status,
      supplierId: entity.supplierId,
      sourceBundleId: entity.sourceBundleId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      supplier: entity.supplier
        ? {
            id: entity.supplier.id,
            name: entity.supplier.name,
            email: entity.supplier.email,
            emailVerified: entity.supplier.emailVerified,
            image: entity.supplier.image,
            role: entity.supplier.role,
            profile: entity.supplier.profile,
          }
        : null,
      buyer: entity.buyer
        ? {
            id: entity.buyer.id,
            name: entity.buyer.name,
            email: entity.buyer.email,
            emailVerified: entity.buyer.emailVerified,
            image: entity.buyer.image,
            role: entity.buyer.role,
            profile: entity.buyer.profile,
          }
        : null,
      items: entity.items.map(item => ({
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        priceSnapshot: item.priceSnapshot,
        titleSnapshot: item.titleSnapshot,
        skuSnapshot: item.skuSnapshot,
        product: item.product
          ? ProductMapper.toResponse(item.product, baseUrl)
          : null,
      })),
    };
  }
}
