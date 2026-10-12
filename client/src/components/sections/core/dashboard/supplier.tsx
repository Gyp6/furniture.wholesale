'use client';

import { buildBuyerStats } from './dashboard-stats';
import { RoleDashboard } from './role-dashboard';

export function SupplierPersonalDashboardPage() {
  return (
    <RoleDashboard
      overviewLabel={'Supplier Personal Overview'}
      unsavedRedirectPath={'/catalog'}
      statsGridClass={'grid grid-cols-3 gap-3'}
      buildStats={buildBuyerStats}
    />
  );
}
