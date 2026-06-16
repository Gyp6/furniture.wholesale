import type { Prisma, User as PrismaUser } from '@prisma/client';

import type { User } from '../entities';

export const USER_REPOSITORY: unique symbol = Symbol('USER_REPOSITORY');
export type USER_REPOSITORY = typeof USER_REPOSITORY;

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findRawById(id: string): Promise<PrismaUser | null>;
  findByEmail(email: string): Promise<User | null>;
  updateById(
    id: string,
    data: Prisma.UserUpdateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<User>;
  updateByEmail(
    email: string,
    data: Prisma.UserUpdateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<User>;
}
