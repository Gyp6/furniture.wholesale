import { UpdateBundleRequest } from '@bundle/application/dto/requests';
import { Bundle, BundleItem } from '@bundle/domain/entities';
import { Bundle as PrismaBundle } from '@prisma/client';
import { BundleType } from '@prisma/client';

import { TProductStatusValues } from '@/common/types';

export const BUNDLE_REPOSITORY: unique symbol = Symbol('BUNDLE_REPOSITORY');
export type BUNDLE_REPOSITORY = typeof BUNDLE_REPOSITORY;

export interface IBundleRepository {
  findAllByUserId(userId: string, type?: BundleType): Promise<Bundle[]>;
  findAllSuppliers(params?: {
    userId?: string;
    companyId?: string;
  }): Promise<Bundle[]>;
  findById(id: string): Promise<Bundle | null>;
  findByShareToken(token: string): Promise<Bundle | null>;
  findRaw(id: string): Promise<PrismaBundle | null>;

  create(bundle: Bundle): Promise<Bundle>;
  update(
    id: string,
    dto: UpdateBundleRequest | { isShared: boolean; shareToken: string | null },
  ): Promise<Bundle>;
  updateStatus(id: string, status: TProductStatusValues): Promise<Bundle>;
  delete(id: string): Promise<void>;

  addItem(bundleId: string, item: BundleItem): Promise<Bundle>;
  removeItem(bundleItemId: string): Promise<void>;
}
