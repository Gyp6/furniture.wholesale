import { IProduct } from './product.interface';

export interface IOrderItem {
  id: string;
  productId: string;
  quantity: number;
  priceSnapshot: number;
  titleSnapshot: string;
  skuSnapshot: string;
  product?: IProduct | null;
}

export interface ISupplier {
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
}

export interface ISubOrder {
  id: string;
  orderId: string;
  supplierId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  items: IOrderItem[];
  supplier?: ISupplier | null;
}

export interface IOrder {
  id: string;
  status: string;
  totalAmount: number;
  platformFee: number;
  createdAt: string;
  updatedAt: string;
  subOrders: ISubOrder[];
}
