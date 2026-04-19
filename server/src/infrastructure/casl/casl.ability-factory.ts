import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  PureAbility,
} from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { Company, SupplierProfile, User } from '@prisma/client';

type AppSubjects =
  | Subjects<{
      User: User;
      Company: Company;
      SupplierProfile: SupplierProfile;
    }>
  | 'all';

export type AppAbility = PureAbility<[string, AppSubjects], PrismaQuery>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const {
      can,
      // cannot,
      build,
    } = new AbilityBuilder<AppAbility>(
      createPrismaAbility as unknown as AbilityClass<AppAbility>,
    );

    if (user.role === 'RETAILER') {
      can('read', 'User', { id: user.id });
      can('update', 'User', { id: user.id });

      if (user.companyId) {
        can('read', 'Company', { id: user.companyId });
      }
    }

    if (user.role === 'ADMIN') {
      can('manage', 'all');
    }

    return build({
      detectSubjectType: item =>
        item.constructor.name as ExtractSubjectType<AppSubjects>,
    });
  }
}
