'use client';

import { buildProjectStats } from './dashboard-stats';
import { RoleDashboard } from './role-dashboard';

export function DesignerDashboardPage() {
  return (
    <RoleDashboard
      overviewLabel={'Designer Overview'}
      unsavedRedirectPath={'/'}
      statsGridClass={'grid grid-cols-2 gap-4'}
      outOfStockOnReorder
      buildStats={buildProjectStats}
    />
  );
}
