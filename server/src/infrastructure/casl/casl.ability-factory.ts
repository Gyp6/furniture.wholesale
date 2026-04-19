import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  PureAbility,
} from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { Company, SupplierProfile, User } from '@prisma/client';

// Тільки ті моделі, які потрібні для старту
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

    // Логіка для RETAILER
    if (user.role === 'RETAILER') {
      // Може читати і редагувати ТІЛЬКИ свій акаунт
      can('read', 'User', { id: user.id });
      can('update', 'User', { id: user.id });

      // Якщо він прив'язаний до компанії — може бачити її дані
      if (user.companyId) {
        can('read', 'Company', { id: user.companyId });
      }
    }

    // Для адміна (щоб ти міг перевіряти реєстрації)
    if (user.role === 'ADMIN') {
      can('manage', 'all');
    }

    return build({
      detectSubjectType: item =>
        item.constructor.name as ExtractSubjectType<AppSubjects>,
    });
  }
}
