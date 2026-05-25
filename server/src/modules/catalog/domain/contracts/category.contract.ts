import type { Category } from '../entities';

export const CATEGORY_REPOSITORY: unique symbol = Symbol('CATEGORY_REPOSITORY');
export type CATEGORY_REPOSITORY = typeof CATEGORY_REPOSITORY;

export interface ICategoryRepository {
  findAll(): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  create(title: string): Promise<Category>;
}
