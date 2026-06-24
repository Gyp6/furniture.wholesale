import { Suspense } from 'react';

import OrderConfirmation from './order-confirmation';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Order Confirmation',
};

export default function OrderConfirmationPage(props: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderConfirmation params={props.params} />
    </Suspense>
  );
}
