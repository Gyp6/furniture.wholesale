import { ForbiddenException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { OrderStatus } from '@prisma/client';
import { nanoid } from 'nanoid';

import type { IReqUser } from '@/common/types';
import { BundleService } from '@/modules/bundle/application/services/bundle.service';
import { PRODUCT_REPOSITORY, type IProductRepository } from '@catalog/domain/contracts/product.contract';

import { ORDER_REPOSITORY, type IOrderRepository } from '@order/domain/contracts/order.contract';
import { Order, SubOrder, OrderItem } from '@order/domain/entities';
import { OrderMapper } from '@order/application/mappers/order.mapper';
import { CreateOrderRequest } from '../dto/requests/create-order.request';
import { OrderResponse, SubOrderResponse } from '../dto/responses/order.response';
import { OrderNotFoundException, SubOrderNotFoundException } from '@order/domain/exceptions/order.exception';

@Injectable()
export class OrderService {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: IOrderRepository,
    @Inject(PRODUCT_REPOSITORY)
    private readonly productRepository: IProductRepository,
    private readonly bundleService: BundleService,
    private readonly configService: ConfigService,
  ) {}

  private get baseUrl(): string {
    return this.configService.get<string>('BASE_URL') ?? '';
  }

  async create(user: IReqUser, dto: CreateOrderRequest): Promise<OrderResponse> {
    const groupedItems: Record<string, Array<{
      productId?: string;
      bundleId?: string;
      quantity: number;
      priceSnapshot: number;
      titleSnapshot: string;
      skuSnapshot: string;
    }>> = {};

    let totalAmount = 0;

    for (const item of dto.items) {
      let supplierId = '';
      let titleSnapshot = '';
      let skuSnapshot = '';

      if (item.productId) {
        const product = await this.productRepository.findOne(item.productId);
        if (!product) {
          throw new NotFoundException(`Product ${item.productId} not found`);
        }
        supplierId = product.supplierId;
        titleSnapshot = product.title;
        skuSnapshot = product.sku;
      } else if (item.bundleId) {
        const bundle = await this.bundleService.findById(item.bundleId);
        if (!bundle) {
          throw new NotFoundException(`Bundle ${item.bundleId} not found`);
        }
        supplierId = bundle.userId;
        titleSnapshot = bundle.name;
        skuSnapshot = bundle.id;
      } else {
        throw new NotFoundException('Order item must contain either productId or bundleId');
      }

      if (!groupedItems[supplierId]) {
        groupedItems[supplierId] = [];
      }

      groupedItems[supplierId].push({
        productId: item.productId,
        bundleId: item.bundleId,
        quantity: item.quantity,
        priceSnapshot: item.priceSnapshot,
        titleSnapshot,
        skuSnapshot,
      });

      totalAmount += item.quantity * item.priceSnapshot;
    }

    const platformFee = totalAmount * 0.04;
    const orderId = nanoid();
    const subOrders: SubOrder[] = [];

    for (const [supplierId, items] of Object.entries(groupedItems)) {
      const subOrderId = nanoid();
      const domainItems = items.map(item => {
        // Only create OrderItem if it's a product (not a bundle)
        // Bundles should be expanded into their products before order creation
        if (!item.productId) {
          throw new NotFoundException('Order items must contain valid productId. Bundles should be expanded into products first.');
        }
        return new OrderItem(
          nanoid(),
          subOrderId,
          item.productId,
          item.quantity,
          item.priceSnapshot,
          item.titleSnapshot,
          item.skuSnapshot,
        );
      });

      subOrders.push(new SubOrder(
        subOrderId,
        orderId,
        OrderStatus.NEW,
        supplierId,
        null,
        domainItems,
        new Date(),
        new Date(),
      ));
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
    );

    const saved = await this.orderRepository.create(orderEntity);
    return OrderMapper.toResponse(saved, this.baseUrl);
  }

  async findAllByUser(user: IReqUser): Promise<any[]> {
    const orders = await this.orderRepository.findAllByBuyerId(user.id);
    return orders.map(ord => OrderMapper.toResponse(ord, this.baseUrl));
  }

  async findReceivedOrders(user: IReqUser): Promise<any[]> {
    if (user.role !== 'SUPPLIER' && user.role !== 'ADMIN') {
      throw new ForbiddenException('Only suppliers can access received orders.');
    }
    const subOrders = await this.orderRepository.findAllBySupplierId(user.id);
    return subOrders.map(sub => OrderMapper.subOrderToResponse(sub, this.baseUrl));
  }

  async findOne(id: string, user: IReqUser): Promise<OrderResponse | SubOrderResponse> {
    // Try to find as a main order (placed order) first
    const order = await this.orderRepository.findById(id);
    if (order && (order.buyerId === user.id || (user.role as any) === 'ADMIN')) {
      return OrderMapper.toResponse(order, this.baseUrl);
    }

    // Try to find as a received sub-order
    const subOrder = await this.orderRepository.findSubOrderById(id);
    if (subOrder && (subOrder.supplierId === user.id || (user.role as any) === 'ADMIN')) {
      return OrderMapper.subOrderToResponse(subOrder, this.baseUrl);
    }

    throw new NotFoundException(`Order or SubOrder with ID ${id} not found or access denied.`);
  }

  async updateStatus(id: string, status: OrderStatus, user: IReqUser): Promise<any> {
    // Check if it's a main order where the user is the buyer (or ADMIN)
    const order = await this.orderRepository.findById(id);
    if (order && (order.buyerId === user.id || (user.role as any) === 'ADMIN')) {
      const updated = await this.orderRepository.updateStatus(id, status);
      return OrderMapper.toResponse(updated, this.baseUrl);
    }

    // Check if it's a sub-order where the user is the supplier (or ADMIN)
    const subOrder = await this.orderRepository.findSubOrderById(id);
    if (subOrder && (subOrder.supplierId === user.id || (user.role as any) === 'ADMIN')) {
      const updated = await this.orderRepository.updateSubOrderStatus(id, status);
      return OrderMapper.subOrderToResponse(updated, this.baseUrl);
    }

    throw new NotFoundException(`Order or SubOrder with ID ${id} not found or access denied.`);
  }
}
