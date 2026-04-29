import {
  AbilityBuilder,
  ExtractSubjectType,
  InferSubjects,
  PureAbility,
} from '@casl/ability';
import { createPrismaAbility, PrismaQuery } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { Company, Profile, Role, User } from '@prisma/client';

import { ECalsAction } from '@/shared/enums';

type AppSubjects =
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  | InferSubjects<User | Company | Profile>
  | 'User'
  | 'Company'
  | 'Profile'
  | 'all';

export type AppAbility = PureAbility<[ECalsAction, AppSubjects], PrismaQuery>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    user: User & { profile?: (Profile & { company?: Company }) | null },
  ) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createPrismaAbility,
    );

    const companyId = user.profile?.companyId;

    if (user.role === Role.ADMIN) {
      can(ECalsAction.Manage, 'all');
    }

    // Об'єднуємо ролі з однаковими правами
    const isBusiness =
      user.role === Role.RETAILER || user.role === Role.SUPPLIER;
    const isPublic = user.role === Role.DESIGNER || user.role === Role.HORECA;

    if (isBusiness || isPublic) {
      can(ECalsAction.Read, 'User', { id: user.id });
      can(ECalsAction.Update, 'User', { id: user.id });
      can(ECalsAction.Read, 'Profile', { userId: user.id });
      can(ECalsAction.Update, 'Profile', { userId: user.id });

      if (isBusiness && companyId) {
        can(ECalsAction.Read, 'Company', { id: companyId });
        can(ECalsAction.Update, 'Company', { id: companyId });
      }

      if (isPublic) {
        can(ECalsAction.Read, 'Company');
      }
    }

    if (user.role !== Role.ADMIN) {
      cannot(ECalsAction.Delete, 'User');
      cannot(ECalsAction.Delete, 'Company');
    }

    // return build({
    //   detectSubjectType: item =>
    //     (item as any).constructor.name as ExtractSubjectType<AppSubjects>,
    // });
    return build({
      detectSubjectType: item =>
        (item as any).__caslSubjectType__ ?? (item as any).constructor.name,
    });
  }
}
