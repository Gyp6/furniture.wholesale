import type { Prisma } from '@prisma/client';

import type { Company } from '../entities';

export const COMPANY_REPOSITORY: unique symbol = Symbol('COMPANY_REPOSITORY');
export type COMPANY_REPOSITORY = typeof COMPANY_REPOSITORY;

export interface ICompanyRepository {
  findByTaxId(
    taxId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Company | null>;
  create(
    data: Prisma.CompanyCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Company>;
}
