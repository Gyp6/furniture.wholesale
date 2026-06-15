import {
  type IProductRepository,
  PRODUCT_REPOSITORY,
} from '@catalog/domain/contracts/product.contract';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderMapper } from '@order/application/mappers/order.mapper';
import {
  type IOrderRepository,
  ORDER_REPOSITORY,
} from '@order/domain/contracts/order.contract';
import { Order, OrderItem, SubOrder } from '@order/domain/entities';
import { OrderStatus } from '@prisma/client';
import { nanoid } from 'nanoid';

import type { IReqUser } from '@/common/types';
import { MailService } from '@/infrastructure/mail/mail.service';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { BundleService } from '@/modules/bundle/application/services/bundle.service';

import { CreateOrderRequest } from '../dto/requests/create-order.request';
import {
  OrderResponse,
  SubOrderResponse,
} from '../dto/responses/order.response';

@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    private readonly bundleService: BundleService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  private get baseUrl(): string {
    return this.configService.get<string>('BASE_URL') ?? '';
  }

  async create(
    user: IReqUser,
    dto: CreateOrderRequest,
  ): Promise<OrderResponse> {
    const groupedItems: Record<
      string,
      Array<{
        productId: string;
        quantity: number;
        priceSnapshot: number;
        titleSnapshot: string;
        skuSnapshot: string;
      }>
    > = {};

    let totalAmount = 0;

    for (const item of dto.items) {
      if (item.productId) {
        const product = await this.productRepository.findOne(item.productId);
        if (!product) {
          throw new NotFoundException(`Product ${item.productId} not found`);
        }
        if (product.status !== 'ACTIVE') {
          throw new BadRequestException(
            `Product "${product.title}" is not available for ordering (status: ${product.status})`,
          );
        }
        if (product.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for "${product.title}": requested ${item.quantity}, available ${product.stock}`,
          );
        }

        const supplierId = product.supplierId;
        if (!groupedItems[supplierId]) {
          groupedItems[supplierId] = [];
        }
        groupedItems[supplierId].push({
          productId: item.productId,
          quantity: item.quantity,
          priceSnapshot: item.priceSnapshot,
          titleSnapshot: product.title,
          skuSnapshot: product.sku,
        });
        totalAmount += item.quantity * item.priceSnapshot;
      } else if (item.bundleId) {
        const bundle = await this.bundleService.findById(item.bundleId);
        if (!bundle) {
          throw new NotFoundException(`Bundle ${item.bundleId} not found`);
        }

        for (const bundleItem of bundle.items) {
          if (!bundleItem.product) continue;

          const product = await this.productRepository.findOne(bundleItem.product.id);
          if (!product) continue;
          if (product.status !== 'ACTIVE') {
            throw new BadRequestException(
              `Product "${product.title}" in bundle "${bundle.name}" is not available for ordering (status: ${product.status})`,
            );
          }
          const qty = bundleItem.quantity * item.quantity;
          if (product.stock < qty) {
            throw new BadRequestException(
              `Insufficient stock for "${product.title}" in bundle "${bundle.name}": requested ${qty}, available ${product.stock}`,
            );
          }

          const supplierId = product.supplierId;
          if (!groupedItems[supplierId]) {
            groupedItems[supplierId] = [];
          }
          groupedItems[supplierId].push({
            productId: product.id,
            quantity: qty,
            priceSnapshot: bundleItem.priceSnapshot,
            titleSnapshot: product.title,
            skuSnapshot: product.sku,
          });
          totalAmount += qty * bundleItem.priceSnapshot;
        }
      } else {
        throw new NotFoundException(
          'Order item must contain either productId or bundleId',
        );
      }
    }

    const platformFee = totalAmount * 0.04;
    const orderId = nanoid();
    const subOrders: SubOrder[] = [];

    for (const [supplierId, items] of Object.entries(groupedItems)) {
      const subOrderId = nanoid();
      const domainItems = items.map(item =>
        new OrderItem(
          nanoid(),
          subOrderId,
          item.productId,
          item.quantity,
          item.priceSnapshot,
          item.titleSnapshot,
          item.skuSnapshot,
        ),
      );

      subOrders.push(
        new SubOrder(
          subOrderId,
          orderId,
          OrderStatus.NEW,
          supplierId,
          null,
          domainItems,
          new Date(),
          new Date(),
        ),
      );
    }

    const orderEntity = new Order(
      orderId,
      user.id,
      OrderStatus.NEW,
      totalAmount,
      platformFee,
      subOrders,
      new Date(),
      new Date(),
      undefined,
      dto.shippingAddress || null,
    );

    const saved = await this.orderRepository.create(orderEntity);

    this.enqueueOrderEmails(saved).catch(err =>
      this.logger.error(
        `Failed to enqueue order emails for ${saved.id}: ${err.message}`,
      ),
    );

    return OrderMapper.toResponse(saved, this.baseUrl);
  }

  async findAllByUser(user: IReqUser): Promise<any[]> {
    const orders = await this.orderRepository.findAllByBuyerId(user.id);
    return orders.map(ord => OrderMapper.toResponse(ord, this.baseUrl));
  }

  async findReceivedOrders(user: IReqUser): Promise<any[]> {
    if (user.role !== 'SUPPLIER' && user.role !== 'ADMIN') {
      throw new ForbiddenException(
        'Only suppliers can access received orders.',
      );
    }
    const subOrders = await this.orderRepository.findAllBySupplierId(user.id);
    return subOrders.map(sub =>
      OrderMapper.subOrderToResponse(sub, this.baseUrl),
    );
  }

  async findOne(
    id: string,
    user: IReqUser,
  ): Promise<OrderResponse | SubOrderResponse> {
    // Try to find as a main order (placed order) first
    const order = await this.orderRepository.findById(id);
    if (
      order &&
      (order.buyerId === user.id || (user.role as any) === 'ADMIN')
    ) {
      return OrderMapper.toResponse(order, this.baseUrl);
    }

    // Try to find as a received sub-order
    const subOrder = await this.orderRepository.findSubOrderById(id);
    if (
      subOrder &&
      (subOrder.supplierId === user.id || (user.role as any) === 'ADMIN')
    ) {
      return OrderMapper.subOrderToResponse(subOrder, this.baseUrl);
    }

    throw new NotFoundException(
      `Order or SubOrder with ID ${id} not found or access denied.`,
    );
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
    user: IReqUser,
  ): Promise<any> {
    // Check if it's a sub-order first (both suppliers and buyers interact with sub-orders)
    const subOrder = await this.orderRepository.findSubOrderById(id);
    if (subOrder) {
      const isBuyer = subOrder.buyer?.id === user.id || (user.role as any) === 'ADMIN';
      const isSupplier = subOrder.supplierId === user.id || (user.role as any) === 'ADMIN';

      if (isSupplier) {
        const allowedTransitions: Record<string, string[]> = {
          NEW: ['PROCESSING', 'CANCELLED'],
          PROCESSING: ['SHIPPED', 'CANCELLED'],
        };
        const allowed = allowedTransitions[subOrder.status] || [];
        if (!allowed.includes(status)) {
          throw new BadRequestException(
            `Cannot change sub-order status from ${subOrder.status} to ${status}.`,
          );
        }

        if (
          subOrder.status === OrderStatus.NEW &&
          status === OrderStatus.PROCESSING
        ) {
          await this.decrementStockForSubOrder(subOrder);
        }

        const updated = await this.orderRepository.updateSubOrderStatus(
          id,
          status,
        );

        this.sendStatusUpdateEmail(subOrder, status).catch(err =>
          this.logger.error(
            `Failed to send status update email for sub-order ${id}: ${err.message}`,
          ),
        );

        await this.syncParentOrderStatus(subOrder.orderId);

        return OrderMapper.subOrderToResponse(updated, this.baseUrl);
      }

      if (isBuyer) {
        if (subOrder.status !== OrderStatus.SHIPPED || status !== OrderStatus.DELIVERED) {
          throw new BadRequestException(
            `Buyers can only mark shipped sub-orders as delivered.`,
          );
        }

        const updated = await this.orderRepository.updateSubOrderStatus(
          id,
          status,
        );

        await this.syncParentOrderStatus(subOrder.orderId);

        return OrderMapper.subOrderToResponse(updated, this.baseUrl);
      }

      throw new NotFoundException(
        `Sub-order with ID ${id} not found or access denied.`,
      );
    }

    // Check if it's a main order (buyer marking entire order)
    const order = await this.orderRepository.findById(id);
    if (
      order &&
      (order.buyerId === user.id || (user.role as any) === 'ADMIN')
    ) {
      if (order.status !== OrderStatus.SHIPPED || status !== OrderStatus.DELIVERED) {
        throw new BadRequestException(
          `Cannot change order status from ${order.status} to ${status}. Buyers can only mark shipped orders as delivered.`,
        );
      }
      const updated = await this.orderRepository.updateStatus(id, status);
      return OrderMapper.toResponse(updated, this.baseUrl);
    }

    throw new NotFoundException(
      `Order or SubOrder with ID ${id} not found or access denied.`,
    );
  }

  private async syncParentOrderStatus(orderId: string): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) return;

    const statuses = order.subOrders.map(s => s.status);

    let newStatus: OrderStatus | null = null;
    if (statuses.every(s => s === OrderStatus.DELIVERED)) {
      newStatus = OrderStatus.DELIVERED;
    } else if (statuses.every(s => s === OrderStatus.SHIPPED || s === OrderStatus.DELIVERED)) {
      newStatus = OrderStatus.SHIPPED;
    } else if (statuses.every(s => s === OrderStatus.CANCELLED)) {
      newStatus = OrderStatus.CANCELLED;
    } else if (statuses.some(s => s === OrderStatus.PROCESSING || s === OrderStatus.SHIPPED || s === OrderStatus.DELIVERED)) {
      newStatus = OrderStatus.PROCESSING;
    }

    if (newStatus && newStatus !== order.status) {
      await this.orderRepository.updateStatus(orderId, newStatus);
    }
  }

  private async sendStatusUpdateEmail(
    subOrder: SubOrder,
    newStatus: OrderStatus,
  ): Promise<void> {
    const buyerEmail = subOrder.buyer?.email;
    if (!buyerEmail) return;

    const subOrderTotal = subOrder.items.reduce(
      (sum, item) => sum + item.quantity * item.priceSnapshot,
      0,
    );

    const data = {
      orderId: subOrder.orderId,
      subOrderId: subOrder.id,
      buyerName: subOrder.buyer?.name || 'Customer',
      supplierName:
        subOrder.supplier?.profile?.company?.name ||
        subOrder.supplier?.name ||
        'Supplier',
      items: subOrder.items.map(item => ({
        titleSnapshot: item.titleSnapshot,
        skuSnapshot: item.skuSnapshot,
        quantity: item.quantity,
        priceSnapshot: item.priceSnapshot,
      })),
      subOrderTotal,
    };

    if (newStatus === OrderStatus.PROCESSING) {
      await this.mailService.sendOrderConfirmedNotification(buyerEmail, data);
    } else if (newStatus === OrderStatus.SHIPPED) {
      await this.mailService.sendOrderShippedNotification(buyerEmail, data);
    }
  }

  async checkStock(
    items: Array<{ productId: string; quantity: number }>,
  ): Promise<
    Array<{
      productId: string;
      title: string;
      requested: number;
      available: number;
      sufficient: boolean;
    }>
  > {
    const results: Array<{
      productId: string;
      title: string;
      requested: number;
      available: number;
      sufficient: boolean;
    }> = [];
    for (const item of items) {
      const product = await this.productRepository.findOne(item.productId);
      if (!product) {
        results.push({
          productId: item.productId,
          title: 'Unknown product',
          requested: item.quantity,
          available: 0,
          sufficient: false,
        });
        continue;
      }
      results.push({
        productId: item.productId,
        title: product.title,
        requested: item.quantity,
        available: product.stock,
        sufficient: product.stock >= item.quantity,
      });
    }
    return results;
  }

  private async enqueueOrderEmails(order: Order): Promise<void> {
    if (order.buyer?.email) {
      await this.mailService.sendOrderConfirmation(order.buyer.email, {
        orderId: order.id,
        buyerName: order.buyer.name,
        totalAmount: order.totalAmount,
        platformFee: order.platformFee,
        createdAt: order.createdAt,
        subOrders: order.subOrders.map(sub => ({
          supplierName:
            sub.supplier?.profile?.company?.name ||
            sub.supplier?.name ||
            'Supplier',
          items: sub.items.map(item => ({
            titleSnapshot: item.titleSnapshot,
            skuSnapshot: item.skuSnapshot,
            quantity: item.quantity,
            priceSnapshot: item.priceSnapshot,
          })),
        })),
      });
    }

    for (const sub of order.subOrders) {
      if (sub.supplier?.email) {
        const subOrderTotal = sub.items.reduce(
          (sum, item) => sum + item.quantity * item.priceSnapshot,
          0,
        );
        await this.mailService.sendSupplierNotification(sub.supplier.email, {
          subOrderId: sub.id,
          orderId: order.id,
          supplierName: sub.supplier.name,
          buyerName: order.buyer?.name || 'Buyer',
          buyerCompany: order.buyer?.profile?.company?.name ?? undefined,
          items: sub.items.map(item => ({
            titleSnapshot: item.titleSnapshot,
            skuSnapshot: item.skuSnapshot,
            quantity: item.quantity,
            priceSnapshot: item.priceSnapshot,
          })),
          subOrderTotal,
          createdAt: order.createdAt,
        });
      }
    }
  }

  private async decrementStockForSubOrder(subOrder: SubOrder): Promise<void> {
    for (const item of subOrder.items) {
      await this.prisma.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }
  }
}
