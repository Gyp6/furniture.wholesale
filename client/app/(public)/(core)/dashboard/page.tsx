import { Metadata } from 'next';
import { Suspense } from 'react';

import { DashboardPage } from '@/components/pages/core/dashboard/dashboard';
import { getServerSession } from '@/services/session.service';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function Dashboard() {
  const { user } = (await getServerSession()) || {};
  return (
    <Suspense fallback={<div>Please authorize</div>}>
      {!user} <div>Please authorize</div>
      <DashboardPage user={user!} />
    </Suspense>
  );
}
