import { AbilityBuilder, AbilityClass, ExtractSubjectType, PureAbility } from '@casl/ability';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';

type AppSubjects = Subjects<{
  User: User;
  // Product: Product;
  // Order: Order;
  // Category: Category;
  all: 'all';
}>;

export type AppAbility = PureAbility<[string, AppSubjects], PrismaQuery>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createPrismaAbility as AbilityClass<AppAbility>,
    );

    if (user.role === 'ADMIN') {
      can('manage', 'all');
    }

    if (user.role === 'SUPPLIER') {
      can('read', 'Product');
      can('create', 'Product');
      can('update', 'Product', { supplierId: user.id }); // Твій захист від "чужого стільця"
      can('read', 'Order');
      can('update', 'Order');
    }

    if (['RETAILER', 'DESIGNER', 'HORECA'].includes(user.role)) {
      can('read', 'Product');
      can('read', 'Category');
      can('create', 'Order');
      can('read', 'Order', { userId: user.id }); // Бачить тільки свої замовлення
    }

    return build({
      detectSubjectType: (item) => item.constructor.name as ExtractSubjectType<AppSubjects>,
    });
  }
}