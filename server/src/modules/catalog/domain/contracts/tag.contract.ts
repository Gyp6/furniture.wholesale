import { Tag } from '@catalog/domain/entities';

export const TAG_REPOSITORY: unique symbol = Symbol('TAG_REPOSITORY');
export type TAG_REPOSITORY = typeof TAG_REPOSITORY;

export interface ITagRepository {
  findAll(): Promise<Tag[]>;
  findById(id: string): Promise<Tag | null>;
  findBySlug(slug: string): Promise<Tag | null>;
}
