import { Profile } from '@identity/domain/entities';
import type {
  Company as PrismaCompany,
  Profile as PrismaProfile,
} from '@prisma/client';

import { ProfileResponse } from '../dto/responses';

import { CompanyMapper } from './company.mapper';

type PrismaProfileWithRelations = PrismaProfile & {
  company: PrismaCompany | null;
};

export class ProfileMapper {
  static toDomain(raw: PrismaProfileWithRelations): Profile {
    return new Profile(
      raw.id,
      raw.userId,
      raw.companyId,
      raw.company ? CompanyMapper.toDomain(raw.company) : null,
      raw.specializations,
    );
  }

  static toResponse(entity: Profile): ProfileResponse {
    return {
      id: entity.id,
      companyId: entity.companyId,
      company: entity.company ? CompanyMapper.toResponse(entity.company) : null,
      specializations: entity.specializations,
    };
  }
}
