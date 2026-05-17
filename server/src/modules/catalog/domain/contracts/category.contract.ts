import type { Category } from '../entities';

export const CATEGORY_REPOSITORY: unique symbol = Symbol('CATEGORY_REPOSITORY');
export type CATEGORY_REPOSITORY = typeof CATEGORY_REPOSITORY;

export interface ICategoryRepository {
  findAll(): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
  create(name: string): Promise<Category>;
}
