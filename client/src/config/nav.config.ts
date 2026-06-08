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
  { label: 'Profile', href: '/profile' },
];

export const NavConfig = [
  { label: 'Marketplace', href: ROUTES.HOME },
  { label: 'Dashboards', href: ROUTES.DASHBOARD },
  { label: 'Profile', href: '/profile' },
];
