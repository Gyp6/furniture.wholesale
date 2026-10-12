'use client';

import { buildBuyerStats } from './dashboard-stats';
import { RoleDashboard } from './role-dashboard';

export function HoRecaDashboardPage() {
  return (
    <RoleDashboard
      overviewLabel={'HoReCa Overview'}
      unsavedRedirectPath={'/'}
      statsGridClass={'grid grid-cols-3 gap-3'}
      projectsTitle={'Active Bundles'}
      emptyProjectsText={'No active bundles yet.'}
      buildStats={buildBuyerStats}
    />
  );
}
