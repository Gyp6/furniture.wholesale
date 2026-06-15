'use client';

import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { OrderCard } from '@/components/ui/order-card';
import { Button } from '@/components/ui/shadcn/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcn/dialog';
import { useGetOrder } from '@/hooks/queries';
import { ICONS } from '@/shared/data/icons';
import { Skeleton } from '@/components/ui/shadcn/skeleton';
import { useSpaceBundleStore } from '@/store/use-space-bundle.store';

type TOrderDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string | null;
};

export function OrderDetailsModal({
  open,
  onOpenChange,
  orderId,
}: TOrderDetailsModalProps) {
  const { data: order, isLoading } = useGetOrder(orderId || '');
  const router = useRouter();
  const { clearBundle, addItem } = useSpaceBundleStore();

  // Flatten items across all sub-orders in the order, or display directly if it is a single sub-order (supplier view)
  const orderItems = order
    ? ('subOrders' in order && order.subOrders
        ? (order.subOrders as any[]).flatMap((sub) =>
            (sub.items as any[]).map((item) => ({
              ...item,
              supplierName:
                sub.supplier?.profile?.company?.name ||
                sub.supplier?.name ||
                'Supplier',
            }))
          )
        : ((order as any).items as any[] || []).map((item) => ({
            ...item,
            supplierName:
              (order as any).supplier?.profile?.company?.name ||
              (order as any).supplier?.name ||
              'Supplier',
          })))
    : [];

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className={'rounded-2xl p-6 flex flex-col gap-5 sm:max-w-[900px]'}
        showCloseButton={false}
      >
        <button
          onClick={() => onOpenChange(false)}
          className={
            'absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center hover:bg-neutral-100 transition-colors'
          }
        >
          <X className={'w-4 h-4 text-muted-foreground'} />
        </button>
        <DialogHeader>
          <DialogTitle className={'text-lg font-semibold'}>
            Order Details {order && `#${order.id.slice(0, 8).toUpperCase()}`}
          </DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className={"grid grid-cols-3 gap-4"}>
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className={"h-[200px] rounded-2xl"} />
            ))}
          </div>
        ) : orderItems.length > 0 ? (
          <div
            className={
              'grid grid-cols-3 gap-4 overflow-y-auto max-h-[500px] scrollbar-hide'
            }
          >
            {orderItems.map((item) => (
              <OrderCard
                key={item.id}
                name={item.titleSnapshot}
                vendor={item.supplierName}
                category={item.product?.category?.title || 'Furniture'}
                minPieces={item.product?.minSellUnits || 1}
                pricePerUnit={item.priceSnapshot}
                quantity={item.quantity}
                image={item.product?.images?.[0] || ''}
              />
            ))}
          </div>
        ) : (
          <div className={"text-center py-8 text-muted-foreground text-sm"}>
            No items found in this order.
          </div>
        )}

        <div
          className={'flex items-center gap-3 pt-2 border-t border-neutral-100'}
        >
          <Button
            variant={'outline'}
            className={'rounded-full h-11 flex-1'}
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <Button
            variant={'default'}
            className={'rounded-full h-11 flex-1 gap-2'}
            disabled={!order || orderItems.length === 0}
            onClick={() => {
              if (!order) return;
              clearBundle();
              for (const item of orderItems) {
                if (!item.product) continue;
                addItem({
                  product: item.product,
                  quantity: item.quantity,
                });
              }
              onOpenChange(false);
              toast.success('Items added to cart!');
              router.push('/cart');
            }}
          >
            <ICONS.RefreshLoading
              size={16}
              color={'currentColor'}
            />
            Reorder
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
