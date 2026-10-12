'use client';

import {
  type DashboardBundles,
  type DashboardOrders,
  type DashboardStat,
  RoleDashboard,
} from './role-dashboard';

const buildStats = (
  orders: DashboardOrders,
  bundles: DashboardBundles,
): DashboardStat[] => [
  {
    label: 'Total Orders',
    value: orders?.length ?? '—',
    icon: 'Cart',
    badge: '+5%',
    badgeColor: 'bg-green-100 text-green-700',
  },
  {
    label: 'Active Projects',
    value: bundles?.length ?? '—',
    icon: 'Bundles',
    badge: 'New',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
];

export function DesignerDashboardPage() {
  return (
    <RoleDashboard
      overviewLabel={'Designer Overview'}
      unsavedRedirectPath={'/'}
      statsGridClass={'grid grid-cols-2 gap-4'}
      outOfStockOnReorder
      buildStats={buildStats}
    />
  );
}
