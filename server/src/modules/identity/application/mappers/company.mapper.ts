import { Company } from '@identity/domain/entities';
import type { Company as PrismaCompany } from '@prisma/client';

import { CompanyResponse } from '../dto/responses';

export class CompanyMapper {
  static toDomain(raw: PrismaCompany): Company {
    return new Company(
      raw.id,
      raw.name,
      raw.taxId,
      raw.description,
      raw.logoUrl,
      raw.verificationStatus,
      Number(raw.ratingAvg),
      raw.ratingCount,
      raw.createdAt,
    );
  }

  static toResponse(entity: Company): CompanyResponse {
    return {
      id: entity.id,
      name: entity.name,
      taxId: entity.taxId,
      logoUrl: entity.logoUrl,
      verificationStatus: entity.verificationStatus,
      ratingAvg: entity.ratingAvg,
      ratingCount: entity.ratingCount,
    };
  }
}
