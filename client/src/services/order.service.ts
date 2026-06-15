import { api } from '@/lib';
import { IProduct } from '@/shared/types';

export interface CreateOrderRequest {
  items: Array<{
    productId?: string;
    bundleId?: string;
    quantity: number;
    priceSnapshot: number;
  }>;
  shippingAddress?: string;
}

export interface OrderItemResponse {
  id: string;
  productId: string;
  quantity: number;
  priceSnapshot: number;
  titleSnapshot: string;
  skuSnapshot: string;
  product?: IProduct | null;
}

export interface SubOrderResponse {
  id: string;
  orderId: string;
  supplierId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItemResponse[];
  supplier?: {
    id: string;
    name: string;
    email: string;
    image: string | null;
    profile?: {
      companyName?: string;
      taxCode?: string;
      company?: {
        name?: string;
      } | null;
    } | null;
  } | null;
}

export interface OrderResponse {
  id: string;
  status: string;
  totalAmount: number;
  platformFee: number;
  createdAt: string;
  subOrders: SubOrderResponse[];
}

export const orderService = {
  async create(dto: CreateOrderRequest): Promise<OrderResponse> {
    const { data } = await api.post('/orders', dto);
    return data;
  },

  async getMyOrders(): Promise<OrderResponse[]> {
    const { data } = await api.get('/orders/my');
    return data;
  },

  async getReceivedOrders(): Promise<SubOrderResponse[]> {
    const { data } = await api.get('/orders/received');
    return data;
  },

  async getOne(id: string): Promise<OrderResponse> {
    const { data } = await api.get(`/orders/${id}`);
    return data;
  },

  async updateStatus(id: string, status: string): Promise<any> {
    const { data } = await api.patch(`/orders/${id}/status`, { status });
    return data;
  },

  async checkStock(items: Array<{ productId: string; quantity: number }>): Promise<Array<{
    productId: string;
    title: string;
    requested: number;
    available: number;
    sufficient: boolean;
  }>> {
    const { data } = await api.post('/orders/check-stock', { items });
    return data;
  },
};
