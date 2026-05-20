import { Company } from '@identity/domain/entities';
import type { Company as PrismaCompany } from '@prisma/client';

import { CompanyResponse } from '../dto/responses';

export class CompanyMapper {
  static toDomain(raw: PrismaCompany): Company {
    return new Company(
      raw.id,
      raw.name,
      raw.abbreviation,
      raw.taxCode,
      raw.description,
      raw.specializations,
      raw.logoUrl,
      raw.verificationStatus,
      Number(raw.ratingAvg),
      raw.ratingCount,
      raw.createdAt,
      raw.terms,
    );
  }

  static toResponse(entity: Company): CompanyResponse {
    return {
      id: entity.id,
      name: entity.name,
      taxCode: entity.taxCode,
      specializations: entity.specializations,
      logoUrl: entity.logoUrl,
      verificationStatus: entity.verificationStatus,
      ratingAvg: entity.ratingAvg,
    };
  }
}
