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
    label: 'Active Bundles',
    value: bundles?.length ?? '—',
    icon: 'Bundles',
    badge: 'New',
    badgeColor: 'bg-blue-100 text-blue-700',
  },
  {
    label: 'Total Spend',
    value: orders
      ? `$${orders.reduce((s, o) => s + (o.totalAmount ?? 0), 0).toLocaleString()}`
      : '—',
    icon: 'WalletFigma',
    badge: 'YTD',
    badgeColor: 'bg-purple-100 text-purple-700',
  },
];

export function SupplierPersonalDashboardPage() {
  return (
    <RoleDashboard
      overviewLabel={'Supplier Personal Overview'}
      unsavedRedirectPath={'/catalog'}
      statsGridClass={'grid grid-cols-3 gap-3'}
      buildStats={buildStats}
    />
  );
}