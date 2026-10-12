import type {
  DashboardBundles,
  DashboardOrders,
  DashboardStat,
} from './role-dashboard';

const totalOrdersStat = (orders: DashboardOrders): DashboardStat => ({
  label: 'Total Orders',
  value: orders?.length ?? '—',
  icon: 'Cart',
  badge: '+5%',
  badgeColor: 'bg-green-100 text-green-700',
});

const bundlesStat = (
  bundles: DashboardBundles,
  label: string,
): DashboardStat => ({
  label,
  value: bundles?.length ?? '—',
  icon: 'Bundles',
  badge: 'New',
  badgeColor: 'bg-blue-100 text-blue-700',
});

const totalSpendStat = (orders: DashboardOrders): DashboardStat => ({
  label: 'Total Spend',
  value: orders
    ? `$${orders.reduce((s, o) => s + (o.totalAmount ?? 0), 0).toLocaleString()}`
    : '—',
  icon: 'WalletFigma',
  badge: 'YTD',
  badgeColor: 'bg-purple-100 text-purple-700',
});

export const buildBuyerStats = (
  orders: DashboardOrders,
  bundles: DashboardBundles,
): DashboardStat[] => [
  totalOrdersStat(orders),
  bundlesStat(bundles, 'Active Bundles'),
  totalSpendStat(orders),
];

export const buildProjectStats = (
  orders: DashboardOrders,
  bundles: DashboardBundles,
): DashboardStat[] => [
  totalOrdersStat(orders),
  bundlesStat(bundles, 'Active Projects'),
];