import type { Metadata } from 'next';
import { Suspense } from 'react';

import { OrderDetailPage } from '@/components/pages/core/orders/order-detail';

export const metadata: Metadata = {
  title: 'Order Details',
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderDetail({ params }: Props) {
  return (
    <Suspense fallback={<div className="p-10 text-center text-muted-foreground">Loading order details...</div>}>
      <OrderDetailPage params={params} />
    </Suspense>
  );
}
