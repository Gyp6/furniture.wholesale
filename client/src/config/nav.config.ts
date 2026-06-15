import { ROUTES } from '@/constants';

export const NavSupplierConfig = [
  { label: 'Marketplace', href: ROUTES.HOME },
  {
    label: 'Dashboards',
    href: ROUTES.DASHBOARD,
    children: [
      { label: 'Personal', href: '/dashboard' },
      { label: 'Professional', href: '/professional' },
    ],
  },
  { label: 'Orders', href: ROUTES.ORDERS },
  { label: 'Profile', href: '/profile' },
];

export const NavConfig = [
  { label: 'Marketplace', href: ROUTES.HOME },
  { label: 'Dashboards', href: ROUTES.DASHBOARD },
  { label: 'Orders', href: ROUTES.ORDERS },
  { label: 'Profile', href: '/profile' },
];
