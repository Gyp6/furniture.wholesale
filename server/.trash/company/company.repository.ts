import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '@/infrastructure/prisma/prisma.service';

@Injectable()
export class CompanyRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: Prisma.CompanyCreateInput, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prismaService;
    return client.company.create({ data });
  }

  async findByTaxId(taxId: string, tx?: Prisma.TransactionClient) {
    const client = tx ?? this.prismaService;
    return client.company.findUnique({ where: { taxId } });
  }
}
