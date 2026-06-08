import { Ability, AbilityBuilder, InferSubjects } from '@casl/ability';
import { createPrismaAbility, PrismaQuery } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { Bundle, Company, Product, Profile, Role, User, Order, SubOrder } from '@prisma/client';

import { ECalsAction } from '@/common/enums';

type AppSubjects =
  | InferSubjects<User | Company | Profile | Product | Bundle | Order | SubOrder>
  | 'User'
  | 'Company'
  | 'Profile'
  | 'Product'
  | 'Bundle'
  | 'Order'
  | 'SubOrder'
  | 'all';

export type AppAbility = Ability<[ECalsAction, AppSubjects], PrismaQuery>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(
    user: User & { profile?: (Profile & { company?: Company }) | null },
  ) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createPrismaAbility,
    );

    const companyId = user.profile?.companyId;

    if (user.role === Role.ADMIN) {
      can(ECalsAction.Manage, 'all');
    }

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

      can(ECalsAction.Read, 'Bundle', { isShared: true });
      can(ECalsAction.Read, 'Bundle', { userId: user.id });
      can(ECalsAction.Update, 'Bundle', { userId: user.id });
      can(ECalsAction.Delete, 'Bundle', { userId: user.id });
    }

    if (user.role === Role.SUPPLIER) {
      can(ECalsAction.Create, 'Product');
      can(ECalsAction.Read, 'Product');
      can(ECalsAction.Update, 'Product', { supplierId: user.id });
      can(ECalsAction.Delete, 'Product', { supplierId: user.id });
    }

    if (isPublic || user.role === Role.RETAILER) {
      can(ECalsAction.Read, 'Product');
    }

    if (user.role !== Role.ADMIN) {
      cannot(ECalsAction.Delete, 'User');
      cannot(ECalsAction.Delete, 'Company');
    }

    return build({
      detectSubjectType: item =>
        (item as any).__caslSubjectType__ ?? (item as any).constructor.name,
    });
  }
}
