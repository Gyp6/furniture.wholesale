import { Company } from '@identity/domain/entities';
import type { Company as PrismaCompany } from '@prisma/client';

import { COMPANY_STATUSES } from '@/common/constants/company-status.constant';

import { CompanyResponse } from '../dto/responses';

export class CompanyMapper {
  static toDomain(raw: PrismaCompany): Company {
    return new Company(
      raw.id,
      raw.name,
      raw.abbreviation,
      raw.taxCode,
      raw.description,
      raw.businessEmail,
      raw.showroomAddress,
      raw.specializations,
      raw.leadTime,
      raw.verificationStatus,
      raw.terms,
      Number(raw.ratingAvg),
      raw.ratingCount,
      raw.createdAt,
    );
  }

  static toResponse(entity: Company): CompanyResponse {
    return {
      id: entity.id,
      name: entity.name,
      abbreviation: entity.abbreviation,
      taxCode: entity.taxCode,
      description: entity.description,
      businessEmail: entity.businessEmail,
      showroomAddress: entity.showroomAddress,
      specializations: entity.specializations,
      isVerified: entity.verificationStatus === COMPANY_STATUSES.VERIFIED,
      terms: entity.terms,
      leadTime: entity.leadTime,
      ratingAvg: entity.ratingAvg,
    };
  }
}
