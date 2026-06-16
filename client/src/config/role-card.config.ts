import { ROLES, ROUTES } from '@/constants';
import { ERole } from '@/shared/enums';
import { TRoleCard } from '@/shared/types';

export const RoleCardsConfig: TRoleCard[] = [
  {
    value: ROLES.RETAILER,
    title: ERole.RETAILER,
    description: [
      'Wholesale pricing for inventory',
      'Logistics automation dashboard',
      'Direct communication with suppliers',
    ],
    label: ERole.RETAILER,
    image: ROUTES.S3('auth/retailer.png'),
  },
  {
    value: ROLES.DESIGNER,
    title: 'Interior ' + ERole.DESIGNER,
    description: [
      'Project moodboard collaboration',
      'Trade-only exclusive catalogs',
      'White-label delivery services',
    ],
    label: ERole.DESIGNER,
    image: ROUTES.S3('auth/designer.png'),
  },
  {
    value: ROLES.HORECA,
    title: ERole.HORECA,
    description: [
      'High-durability contract grade',
      'Bulk procurement discounts',
      'Installation & assembly support',
    ],
    label: ERole.HORECA,
    image: ROUTES.S3('auth/horeca.png'),
  },
  {
    value: ROLES.SUPPLIER,
    title: ERole.SUPPLIER,
    description: [
      'Global distribution channel',
      'Smart inventory management',
      'Real-time market analytics',
    ],
    label: ERole.SUPPLIER,
    image: ROUTES.S3('auth/supplier.png'),
  },
];
