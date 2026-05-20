import { CompanyMapper } from '@identity/application/mappers';
import { ICompanyRepository } from '@identity/domain/contracts';
import { Company } from '@identity/domain/entities';
import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '@/infrastructure/prisma/prisma.service';

@Injectable()
export class CompanyRepository implements ICompanyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByTaxCode(
    taxCode: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Company | null> {
    const client = tx ?? this.prisma;
    const raw = await client.company.findUnique({ where: { taxCode } });
    return raw ? CompanyMapper.toDomain(raw) : null;
  }

  async findByAbbreviation(
    abbreviation: string,
    tx?: Prisma.TransactionClient,
  ): Promise<Company | null> {
    const client = tx ?? this.prisma;
    const raw = await client.company.findUnique({ where: { abbreviation } });
    return raw ? CompanyMapper.toDomain(raw) : null;
  }

  async create(
    data: Prisma.CompanyCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Company> {
    const client = tx ?? this.prisma;
    const raw = await client.company.create({ data });
    return CompanyMapper.toDomain(raw);
  }
}
