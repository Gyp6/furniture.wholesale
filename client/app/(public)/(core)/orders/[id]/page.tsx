import { Metadata } from 'next';
import OrderDetail from './orders-id';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Order Detail',
};

export default function OrderDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderDetail params={props.params} />
    </Suspense>
  );
}
