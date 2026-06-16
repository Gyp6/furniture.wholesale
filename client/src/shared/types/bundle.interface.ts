import { IFilter } from './category.interface';
import { IProduct } from './product.interface';

export interface IBundleItem {
  id: string;
  quantity: number;
  priceSnapshot: number;
  createdAt: string;
  product: IProduct | null;
  nestedBundle: IBundle | null;
}

export interface IBundle {
  id: string;
  bundleType: 'SUPPLIER' | 'USER';
  depth: number;
  userId: string;
  name: string;
  description: string | null;
  status: string;
  isShared: boolean;
  shareToken: string | null;
  shareUrl: string | null;
  space: IFilter;
  parentBundleId: string | null;
  items: IBundleItem[];
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
}
