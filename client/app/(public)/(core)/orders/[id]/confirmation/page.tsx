import { OrderConfirmationPage } from '@/components/pages/core/orders/order-confirmation';

export default function OrderConfirmation(props: { params: Promise<{ id: string }> }) {
  return <OrderConfirmationPage params={props.params} />;
}
