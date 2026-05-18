import { CreateProductRequest } from '@catalog/application/dto/requests';
import { Product } from '@catalog/domain/entities';
import { Product as PrismaProduct } from '@prisma/client';

import { TProductStatusValues } from '@/common/types';

export const PRODUCT_REPOSITORY: unique symbol = Symbol('PRODUCT_REPOSITORY');
export type PRODUCT_REPOSITORY = typeof PRODUCT_REPOSITORY;

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findOne(id: string): Promise<Product | null>;
  findRaw(id: string): Promise<PrismaProduct | null>;
  create(
    supplierId: string,
    vendorId: string,
    dto: CreateProductRequest,
  ): Promise<Product>;
  update(id: string, dto: Partial<CreateProductRequest>): Promise<Product>;
  updateStatus(id: string, status: TProductStatusValues): Promise<Product>;
  delete(id: string): Promise<void>;
}
