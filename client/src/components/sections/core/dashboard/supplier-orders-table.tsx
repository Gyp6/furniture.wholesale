'use client';

import { Check, X } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/shadcn/button';
import { Skeleton } from '@/components/ui/shadcn/skeleton';
import { ORDER_STATUS_STYLES } from '@/constants/dashboard.const';

/* eslint-disable @typescript-eslint/no-explicit-any -- API orders are untyped in this module */
export type TSupplierOrder = any;

export type TUpdateStatus = (
  vars: { id: string; status: string },
  callbacks: { onSuccess: (v: unknown) => void; onError: (e: unknown) => void },
) => void;

const ORDER_GRID = 'grid grid-cols-[0.8fr_1.2fr_0.8fr_1fr_1fr_0.8fr_1.2fr]';
const ORDER_COLUMNS = [
  'ORDER ID',
  'CLIENT',
  'ITEMS',
  'DATE',
  'STATUS',
  'TOTAL',
  'ACTIONS',
];

type TStatusTransition = {
  next: string;
  loading: string;
  success: string;
  error: string;
};

const TRANSITIONS: Record<string, TStatusTransition> = {
  confirm: {
    next: 'PROCESSING',
    loading: 'Confirming order...',
    success: 'Order confirmed! Stock has been updated.',
    error: 'Failed to confirm order.',
  },
  reject: {
    next: 'CANCELLED',
    loading: 'Rejecting order...',
    success: 'Order has been rejected.',
    error: 'Failed to reject order.',
  },
  ship: {
    next: 'SHIPPED',
    loading: 'Marking as shipped...',
    success: 'Order marked as shipped!',
    error: 'Failed to update order.',
  },
};

/** Sum of `priceSnapshot * quantity` over the order items. */
export function orderSubtotal(order: TSupplierOrder): number {
  return order.items.reduce(
    (sum: number, item: any) => sum + item.priceSnapshot * item.quantity,
    0,
  );
}

function runTransition(
  updateStatus: TUpdateStatus,
  orderId: string,
  transition: TStatusTransition,
) {
  toast.promise(
    new Promise((resolve, reject) => {
      updateStatus(
        { id: orderId, status: transition.next },
        { onSuccess: resolve, onError: reject },
      );
    }),
    {
      loading: transition.loading,
      success: transition.success,
      error: transition.error,
    },
  );
}

type TOrderActionsProps = {
  order: TSupplierOrder;
  updateStatus: TUpdateStatus;
};

/** Action buttons available for the current order status. */
function OrderActions({ order, updateStatus }: TOrderActionsProps) {
  const run = (key: keyof typeof TRANSITIONS) =>
    runTransition(updateStatus, order.id, TRANSITIONS[key]);

  if (order.status === 'NEW') {
    return (
      <div
        className={'flex items-center gap-2'}
        onClick={e => e.stopPropagation()}
      >
        <button
          className={
            'w-10 h-10 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-200 transition-colors'
          }
          onClick={() => run('confirm')}
        >
          <Check className={'w-5 h-5 text-green-600'} />
        </button>
        <button
          className={
            'w-10 h-10 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors'
          }
          onClick={() => run('reject')}
        >
          <X className={'w-5 h-5 text-red-500'} />
        </button>
      </div>
    );
  }

  if (order.status === 'PROCESSING') {
    return (
      <div
        className={'flex items-center'}
        onClick={e => e.stopPropagation()}
      >
        <Button
          variant={'outline'}
          size={'sm'}
          className={
            'rounded-2xl text-[12px] h-8 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
          }
          onClick={() => run('ship')}
        >
          Mark Shipped
        </Button>
      </div>
    );
  }

  return <div />;
}

type TOrderRowProps = {
  order: TSupplierOrder;
  updateStatus: TUpdateStatus;
  onOpen: (orderId: string) => void;
};

function OrderRow({ order, updateStatus, onOpen }: TOrderRowProps) {
  const clientName =
    order.buyer?.profile?.company?.name ||
    order.buyer?.name ||
    'Individual client';

  return (
    <div
      className={`${ORDER_GRID} items-center px-5 py-3 border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors cursor-pointer`}
      onClick={() => onOpen(order.id)}
    >
      <span className={'text-sm font-medium text-muted-foreground'}>
        #{order.id.slice(0, 8).toUpperCase()}
      </span>

      <div className={'flex flex-col min-w-0'}>
        <span className={'text-sm font-semibold text-neutral-800 truncate'}>
          {clientName}
        </span>
        <span className={'text-[11px] text-muted-foreground truncate'}>
          {order.buyer?.email}
        </span>
      </div>

      <div className={'flex items-center gap-1'}>
        <div className={'flex -space-x-2'}>
          <div
            className={
              'w-6 h-6 rounded-full bg-neutral-300 border-2 border-white'
            }
          />
        </div>
        <span className={'text-[14px] text-muted-foreground ml-0.5'}>
          {order.items?.length || 0} items
        </span>
      </div>

      <span className={'text-sm text-muted-foreground'}>
        {new Date(order.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </span>

      <span
        className={`inline-flex w-fit px-2.5 py-0.5 rounded-full text-[14px] font-bold uppercase tracking-wide ${ORDER_STATUS_STYLES[order.status] ?? 'bg-neutral-100 text-neutral-700'}`}
      >
        {order.status}
      </span>

      <span className={'text-sm font-semibold'}>
        $
        {orderSubtotal(order).toLocaleString('en-US', {
          minimumFractionDigits: 2,
        })}
      </span>

      <OrderActions
        order={order}
        updateStatus={updateStatus}
      />
    </div>
  );
}

type TOrdersBodyProps = {
  orders?: TSupplierOrder[];
  loading: boolean;
  updateStatus: TUpdateStatus;
  onOpen: (orderId: string) => void;
};

function OrdersBody({
  orders,
  loading,
  updateStatus,
  onOpen,
}: TOrdersBodyProps) {
  if (loading) {
    return (
      <div className={'flex flex-col gap-2 p-4'}>
        {[...Array(5)].map((_, i) => (
          <Skeleton
            key={i}
            className={'h-12 rounded-xl'}
          />
        ))}
      </div>
    );
  }

  if (!orders?.length) {
    return (
      <div
        className={
          'flex items-center justify-center h-full py-12 text-muted-foreground text-sm'
        }
      >
        No orders received yet.
      </div>
    );
  }

  return (
    <>
      {orders.map((order, i) => (
        <OrderRow
          key={order.id || i}
          order={order}
          updateStatus={updateStatus}
          onOpen={onOpen}
        />
      ))}
    </>
  );
}

/** "Orders" table of the supplier professional dashboard. */
export function SupplierOrdersTable(props: TOrdersBodyProps) {
  return (
    <div className={'flex flex-col min-h-0 flex-1'}>
      <h2 className={'text-2xl font-semibold mb-3'}>Orders</h2>
      <div
        className={
          'rounded-2xl border border-neutral-100 overflow-hidden flex flex-col min-h-0 flex-1 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.08)]'
        }
      >
        <div
          className={`${ORDER_GRID} px-5 py-3 border-b border-neutral-100 shrink-0`}
        >
          {ORDER_COLUMNS.map(col => (
            <span
              key={col}
              className={
                'text-[14px] font-bold uppercase tracking-widest text-muted-foreground'
              }
            >
              {col}
            </span>
          ))}
        </div>

        <div className={'overflow-y-auto scrollbar-hide flex-1'}>
          <OrdersBody {...props} />
        </div>
      </div>
    </div>
  );
}
