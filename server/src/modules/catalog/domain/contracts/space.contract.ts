import { Space } from '@catalog/domain/entities';

export const SPACE_REPOSITORY: unique symbol = Symbol('SPACE_REPOSITORY');
export type SPACE_REPOSITORY = typeof SPACE_REPOSITORY;

export interface ISpaceRepository {
  findAll(): Promise<Space[]>;
  findById(id: string): Promise<Space | null>;
  findBySlug(slug: string): Promise<Space | null>;
}
