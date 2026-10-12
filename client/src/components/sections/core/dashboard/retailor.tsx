'use client';

import { buildProjectStats } from './dashboard-stats';
import { RoleDashboard } from './role-dashboard';

export function RetailorDashboardPage() {
  return (
    <RoleDashboard
      overviewLabel={'Retailor Overview'}
      unsavedRedirectPath={'/'}
      statsGridClass={'grid grid-cols-2 gap-4'}
      buildStats={buildProjectStats}
    />
  );
}
