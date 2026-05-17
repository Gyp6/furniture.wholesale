import { User } from '@identity/domain/entities';
import type {
  Company as PrismaCompany,
  Profile as PrismaProfile,
  User as PrismaUser,
} from '@prisma/client';

import { UserResponse } from '../dto/responses';

import { ProfileMapper } from './profile.mapper';

type PrismaUserWithRelations = PrismaUser & {
  profile: (PrismaProfile & { company: PrismaCompany | null }) | null;
};

export class UserMapper {
  static toDomain(raw: PrismaUserWithRelations): User {
    if (raw.role === 'ADMIN') {
      throw new Error('Admin role is not allowed in this domain context');
    }

    return new User(
      raw.id,
      raw.name,
      raw.email,
      raw.emailVerified,
      raw.image,
      raw.role,
      raw.banned ?? false,
      raw.profile ? ProfileMapper.toDomain(raw.profile) : null,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  static toResponse(entity: User): UserResponse {
    return {
      id: entity.id,
      name: entity.name,
      email: entity.email,
      emailVerified: entity.emailVerified,
      image: entity.image,
      role: entity.role,
      profile: entity.profile ? ProfileMapper.toResponse(entity.profile) : null,
    };
  }
}
