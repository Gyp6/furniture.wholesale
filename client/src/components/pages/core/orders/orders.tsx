'use client';

import { format } from 'date-fns';
import {
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Package,
  Truck,
  XCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/shadcn/badge';
import { Button } from '@/components/ui/shadcn/button';
import { Card } from '@/components/ui/shadcn/card';
import { Skeleton } from '@/components/ui/shadcn/skeleton';
import {
  useGetMyOrders,
  useGetReceivedOrders,
  useUpdateOrderStatus,
} from '@/hooks/queries';
import { useAuthStatus } from '@/hooks/use-auth-status.hook';

const ORDER_STATUS_CONFIG = {
  NEW: { label: 'New', color: 'bg-blue-100 text-blue-700', icon: Clock },
  CONFIRMED: {
    label: 'Confirmed',
    color: 'bg-green-100 text-green-700',
    icon: CheckCircle2,
  },
  PROCESSING: {
    label: 'Processing',
    color: 'bg-yellow-100 text-yellow-700',
    icon: AlertCircle,
  },
  SHIPPED: {
    label: 'Shipped',
    color: 'bg-purple-100 text-purple-700',
    icon: Package,
  },
  DELIVERED: {
    label: 'Delivered',
    color: 'bg-green-100 text-green-700',
    icon: CheckCircle2,
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-700',
    icon: XCircle,
  },
};

type Tab = 'my' | 'received';

export function OrdersPage() {
  const router = useRouter();
  const { user } = useAuthStatus();
  const [activeTab, setActiveTab] = useState<Tab>('my');

  const { data: myOrders, isLoading: myLoading } = useGetMyOrders();
  const { data: receivedOrders, isLoading: receivedLoading } =
    useGetReceivedOrders();
  const { mutate: updateStatus } = useUpdateOrderStatus();

  const isSupplier = user?.role === 'SUPPLIER' || user?.role === 'ADMIN';
  const isLoading = activeTab === 'my' ? myLoading : receivedLoading;
  const orders = activeTab === 'my' ? myOrders : receivedOrders;

  if (isLoading) {
    return (
      <div className={'w-full max-w-6xl mx-auto p-6 space-y-4'}>
        <Skeleton className={'h-10 w-48'} />
        {[...Array(3)].map((_, i) => (
          <Skeleton
            key={i}
            className={'h-48 w-full rounded-[30px]'}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={'w-full max-w-6xl mx-auto p-6 space-y-6'}>
      <div className={'flex items-center justify-between mb-8'}>
        <div className={'flex items-center gap-4'}>
          <h1 className={'text-4xl font-medium tracking-tight'}>
            {activeTab === 'my' ? 'My Orders' : 'Received Orders'}
          </h1>
          {orders && orders.length > 0 && (
            <Badge
              variant={'secondary'}
              className={'text-sm px-3 py-1'}
            >
              {orders.length} {orders.length === 1 ? 'order' : 'orders'}
            </Badge>
          )}
        </div>
      </div>

      {isSupplier && (
        <div className={'flex gap-2'}>
          <Button
            variant={activeTab === 'my' ? 'default' : 'outline'}
            className={'rounded-full px-6'}
            onClick={() => setActiveTab('my')}
          >
            My Orders
          </Button>
          <Button
            variant={activeTab === 'received' ? 'default' : 'outline'}
            className={'rounded-full px-6'}
            onClick={() => setActiveTab('received')}
          >
            Received Orders
          </Button>
        </div>
      )}

      {!orders || orders.length === 0 ? (
        <div
          className={
            'flex flex-col items-center justify-center p-16 bg-white rounded-[30px]'
          }
        >
          <Package className={'w-16 h-16 text-muted-foreground mb-4'} />
          <h3 className={'text-xl font-medium mb-2'}>
            {activeTab === 'my' ? 'No orders yet' : 'No received orders'}
          </h3>
          <p className={'text-muted-foreground mb-6'}>
            {activeTab === 'my'
              ? 'Browse the catalog and place your first order'
              : 'Orders from buyers will appear here'}
          </p>
          {activeTab === 'my' && (
            <Button onClick={() => router.push('/')}>Go to Catalog</Button>
          )}
        </div>
      ) : (
        <div className={'space-y-4'}>
          {orders.map(order => {
            const statusConfig =
              ORDER_STATUS_CONFIG[
                order.status as keyof typeof ORDER_STATUS_CONFIG
              ] || ORDER_STATUS_CONFIG.NEW;
            const StatusIcon = statusConfig.icon;

            const isSubOrder = activeTab === 'received';
            const itemCount = isSubOrder
              ? ((order as any).items?.length ?? 0)
              : ((order as any).subOrders?.reduce(
                  (s: number, so: any) => s + so.items.length,
                  0,
                ) ?? 0);

            return (
              <Card
                key={order.id}
                className={
                  'bg-white p-6 rounded-[30px] border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer'
                }
                onClick={() => router.push(`/orders/${order.id}`)}
              >
                <div className={'flex items-start justify-between gap-4'}>
                  <div className={'flex-1 space-y-3'}>
                    <div className={'flex items-center gap-3'}>
                      <Badge
                        className={`${statusConfig.color} flex items-center gap-1 px-3 py-1`}
                      >
                        <StatusIcon className={'w-3 h-3'} />
                        {statusConfig.label}
                      </Badge>
                      <span className={'text-sm text-muted-foreground'}>
                        {format(
                          new Date(order.createdAt),
                          'dd MMM yyyy, HH:mm',
                        )}
                      </span>
                      {isSubOrder && (
                        <Badge
                          variant={'outline'}
                          className={'text-xs'}
                        >
                          Received
                        </Badge>
                      )}
                    </div>

                    <div className={'flex items-baseline gap-4'}>
                      <div>
                        <p className={'text-sm text-muted-foreground'}>
                          {isSubOrder ? 'Sub-order' : 'Order'}
                        </p>
                        <p className={'font-mono text-sm'}>
                          #{order.id.slice(0, 8)}
                        </p>
                      </div>
                      <div>
                        <p className={'text-sm text-muted-foreground'}>Total</p>
                        <p className={'text-lg font-semibold'}>
                          $
                          {(
                            (order as any).totalAmount ??
                            (order as any).items?.reduce(
                              (s: number, i: any) =>
                                s + i.quantity * i.priceSnapshot,
                              0,
                            ) ??
                            0
                          ).toLocaleString('en-US', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div>
                        <p className={'text-sm text-muted-foreground'}>Items</p>
                        <p className={'text-sm font-medium'}>{itemCount}</p>
                      </div>
                    </div>

                    {!isSubOrder && (order as any).subOrders && (
                      <div className={'flex items-center gap-2'}>
                        <p className={'text-sm text-muted-foreground'}>
                          Split into {(order as any).subOrders.length}{' '}
                          {(order as any).subOrders.length === 1
                            ? 'supplier'
                            : 'suppliers'}
                        </p>
                        <div className={'flex gap-1'}>
                          {(order as any).subOrders
                            .slice(0, 3)
                            .map((sub: any, idx: number) => (
                              <Badge
                                key={sub.id}
                                variant={'outline'}
                                className={'text-xs'}
                              >
                                {sub.supplier?.profile?.companyName ||
                                  sub.supplier?.name ||
                                  `Supplier ${idx + 1}`}
                              </Badge>
                            ))}
                          {(order as any).subOrders.length > 3 && (
                            <Badge
                              variant={'outline'}
                              className={'text-xs'}
                            >
                              +{(order as any).subOrders.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {isSubOrder && (order as any).order?.buyer && (
                      <div className={'flex items-center gap-2'}>
                        <p className={'text-sm text-muted-foreground'}>
                          Buyer: {(order as any).order.buyer.name || 'Unknown'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className={'flex items-center gap-2 shrink-0'}>
                    {isSubOrder && order.status === 'NEW' && (
                      <div
                        className={'flex items-center gap-2'}
                        onClick={e => e.stopPropagation()}
                      >
                        <Button
                          size={'sm'}
                          className={
                            'rounded-full h-8 gap-1 bg-green-600 hover:bg-green-700 text-xs'
                          }
                          onClick={() => {
                            toast.promise(
                              new Promise((resolve, reject) => {
                                updateStatus(
                                  { id: order.id, status: 'PROCESSING' },
                                  { onSuccess: resolve, onError: reject },
                                );
                              }),
                              {
                                loading: 'Confirming order...',
                                success: 'Order confirmed!',
                                error: 'Failed to confirm order.',
                              },
                            );
                          }}
                        >
                          <CheckCircle2 className={'w-3 h-3'} />
                          Confirm
                        </Button>
                        <Button
                          size={'sm'}
                          variant={'outline'}
                          className={
                            'rounded-full h-8 gap-1 text-red-600 border-red-200 hover:bg-red-50 text-xs'
                          }
                          onClick={() => {
                            toast.promise(
                              new Promise((resolve, reject) => {
                                updateStatus(
                                  { id: order.id, status: 'CANCELLED' },
                                  { onSuccess: resolve, onError: reject },
                                );
                              }),
                              {
                                loading: 'Rejecting order...',
                                success: 'Order rejected.',
                                error: 'Failed to reject order.',
                              },
                            );
                          }}
                        >
                          <XCircle className={'w-3 h-3'} />
                          Reject
                        </Button>
                      </div>
                    )}
                    {isSubOrder && order.status === 'PROCESSING' && (
                      <div onClick={e => e.stopPropagation()}>
                        <Button
                          size={'sm'}
                          className={
                            'rounded-full h-8 gap-1 bg-blue-600 hover:bg-blue-700 text-xs'
                          }
                          onClick={() => {
                            toast.promise(
                              new Promise((resolve, reject) => {
                                updateStatus(
                                  { id: order.id, status: 'SHIPPED' },
                                  { onSuccess: resolve, onError: reject },
                                );
                              }),
                              {
                                loading: 'Marking as shipped...',
                                success: 'Order marked as shipped!',
                                error: 'Failed to update order.',
                              },
                            );
                          }}
                        >
                          <Truck className={'w-3 h-3'} />
                          Mark Shipped
                        </Button>
                      </div>
                    )}
                    {!isSubOrder && order.status === 'SHIPPED' && (
                      <div onClick={e => e.stopPropagation()}>
                        <Button
                          size={'sm'}
                          className={
                            'rounded-full h-8 gap-1 bg-green-600 hover:bg-green-700 text-xs'
                          }
                          onClick={() => {
                            toast.promise(
                              new Promise((resolve, reject) => {
                                updateStatus(
                                  { id: order.id, status: 'DELIVERED' },
                                  { onSuccess: resolve, onError: reject },
                                );
                              }),
                              {
                                loading: 'Marking as delivered...',
                                success: 'Order marked as delivered!',
                                error: 'Failed to update order.',
                              },
                            );
                          }}
                        >
                          <CheckCircle2 className={'w-3 h-3'} />
                          Mark Delivered
                        </Button>
                      </div>
                    )}
                    <Button
                      variant={'ghost'}
                      size={'icon'}
                      className={'shrink-0'}
                    >
                      <ChevronRight className={'w-5 h-5'} />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
