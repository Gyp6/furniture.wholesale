'use client';

import { X } from 'lucide-react';

import { OrderCard } from '@/components/ui/order-card';
import { Button } from '@/components/ui/shadcn/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcn/dialog';
import { OrderCardData } from '@/shared/data/core/catalog/catalog.data';
import { ICONS } from '@/shared/data/icons';

type TOrderDetailsModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function OrderDetailsModal({
  open,
  onOpenChange,
}: TOrderDetailsModalProps) {
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
            Order Details
          </DialogTitle>
        </DialogHeader>
        \{' '}
        <div
          className={
            'grid grid-cols-3 gap-4 overflow-y-auto max-h-[500px] scrollbar-hide'
          }
        >
          {[...Array(6)].map((_, i) => (
            <OrderCard
              key={i}
              name={OrderCardData.name}
              vendor={OrderCardData.vendor}
              category={OrderCardData.category}
              minPieces={OrderCardData.minPieces}
              pricePerUnit={OrderCardData.pricePerUnit}
              quantity={OrderCardData.quantity}
              image={OrderCardData.image}
            />
          ))}
        </div>
        \{' '}
        <div
          className={'flex items-center gap-3 pt-2 border-t border-neutral-100'}
        >
          <Button
            variant={'outline'}
            className={'rounded-full h-11 flex-1'}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant={'default'}
            className={'rounded-full h-11 flex-1 gap-2'}
          >
            <ICONS.RefreshLoading
              size={16}
              color={'currentColor'}
            />
            Order again
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
