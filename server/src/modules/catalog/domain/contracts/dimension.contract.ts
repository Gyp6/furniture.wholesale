import { Dimension } from '@catalog/domain/entities';

export const DIMENSION_REPOSITORY: unique symbol = Symbol(
  'DIMENSION_REPOSITORY',
);
export type DIMENSION_REPOSITORY = typeof DIMENSION_REPOSITORY;

export interface IDimensionRepository {
  findAll(): Promise<Dimension[]>;
}
