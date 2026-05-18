import type { Prisma } from '@prisma/client';

import type { Profile } from '../entities';

export const PROFILE_REPOSITORY: unique symbol = Symbol('PROFILE_REPOSITORY');
export type PROFILE_REPOSITORY = typeof PROFILE_REPOSITORY;

export interface IProfileRepository {
  findByUserId(userId: string): Promise<Profile | null>;
  create(
    data: Prisma.ProfileCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Profile>;
  updateByUserId(
    userId: string,
    data: Prisma.ProfileUpdateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Profile>;
}
