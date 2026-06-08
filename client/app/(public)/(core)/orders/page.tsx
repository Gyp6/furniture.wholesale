import type { Metadata } from 'next';
import { Suspense } from 'react';

import { OrdersPage } from '@/components/pages/core/orders/orders';

export const metadata: Metadata = {
  title: 'My Orders',
};

export default function Orders() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-muted-foreground">Loading orders...</div>}>
      <OrdersPage />
    </Suspense>
  );
}
