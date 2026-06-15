import { OrderDetailPage } from '@/components/pages/core/orders/order-detail';

export default function OrderDetail(props: { params: Promise<{ id: string }> }) {
  return <OrderDetailPage params={props.params} />;
}
