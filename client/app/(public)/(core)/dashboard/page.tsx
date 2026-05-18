import { Metadata } from 'next';
import { Suspense } from 'react';

import {
  DesignerDashboardPage,
  HoRecaDashboardPage,
  RetailorDashboardPage,
  SupplierDashboardPage,
} from '@/components/sections/core/dashboard';
import { ROLES } from '@/constants';
import { getServerSession } from '@/services/session.service';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function Dashboard() {
  const { user } = (await getServerSession()) || {};
  return (
    <div className={'px-10'}>
      <Suspense>
        {user?.role === ROLES.DESIGNER && <DesignerDashboardPage />}

        {user?.role === ROLES.HORECA && <HoRecaDashboardPage />}
        {user?.role === ROLES.RETAILER && <RetailorDashboardPage />}
        {user?.role === ROLES.SUPPLIER && <SupplierDashboardPage />}
      </Suspense>
    </div>
  );
}
