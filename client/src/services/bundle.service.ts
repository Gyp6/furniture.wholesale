import { api } from '@/lib';
import { IBundle } from '@/shared/types';

export interface CreateBundleRequest {
  name: string;
  description?: string;
  bundleType: 'SUPPLIER' | 'USER';
  spaceTypeId: string;
}

export interface AddBundleItemRequest {
  productId?: string;
  nestedBundleId?: string;
  quantity: number;
  priceSnapshot: number;
}

export const bundleService = {
  async getMyBundles(type?: 'USER' | 'SUPPLIER'): Promise<IBundle[]> {
    const { data } = await api.get('/bundles/my', {
      params: { type },
    });
    return data;
  },

  async getSupplierBundles(params?: {
    supplierId?: string;
    companyId?: string;
  }): Promise<IBundle[]> {
    const { data } = await api.get('/bundles/supplier', {
      params,
    });
    return data;
  },

  async getOne(id: string): Promise<IBundle> {
    const { data } = await api.get(`/bundles/${id}`);
    return data;
  },

  async getByShareToken(token: string): Promise<IBundle> {
    const { data } = await api.get(`/bundles/share/${token}`);
    return data;
  },

  async create(dto: CreateBundleRequest): Promise<IBundle> {
    const { data } = await api.post('/bundles', dto);
    return data;
  },

  async update(id: string, dto: Partial<CreateBundleRequest>): Promise<IBundle> {
    const { data } = await api.patch(`/bundles/${id}`, dto);
    return data;
  },

  async addItem(
    bundleId: string,
    item: AddBundleItemRequest,
  ): Promise<IBundle> {
    const { data } = await api.post(`/bundles/${bundleId}/items`, item);
    return data;
  },

  async removeItem(bundleId: string, itemId: string): Promise<void> {
    await api.delete(`/bundles/${bundleId}/items/${itemId}`);
  },

  async fork(id: string): Promise<IBundle> {
    const { data } = await api.post(`/bundles/${id}/fork`);
    return data;
  },

  async share(id: string): Promise<IBundle> {
    const { data } = await api.post(`/bundles/${id}/share`);
    return data;
  },
};
