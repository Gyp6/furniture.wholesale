'use client';

import { Check, X } from 'lucide-react';

import { OrderCard } from '@/components/ui/order-card';
import { Button } from '@/components/ui/shadcn/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcn/dialog';
import { OrderCardData } from '@/shared/data/core/catalog';

type TOrderConfirmModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function OrderConfirmModal({
  open,
  onOpenChange,
}: TOrderConfirmModalProps) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className={'rounded-2xl p-6 flex flex-col gap-5 sm:max-w-[680px]'}
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

        <div
          className={
            'grid grid-cols-2 gap-4 overflow-y-auto max-h-[460px] scrollbar-hide'
          }
        >
          {[...Array(5)].map((_, i) => (
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
          {/* <BundleCard
            isAuthorized={true}
            bundle={BundleCardData}
            hideButton={true}
          /> */}
        </div>

        <div
          className={
            'flex items-center justify-center gap-3 pt-2 border-t border-neutral-100'
          }
        >
          <Button
            variant={'outline'}
            className={
              'rounded-full h-11 px-8 gap-2 border-red-200 text-red-500 hover:bg-red-50'
            }
            onClick={() => onOpenChange(false)}
          >
            <X className={'w-4 h-4'} />
            Cancel order
          </Button>
          <Button
            variant={'default'}
            className={
              'rounded-full h-11 px-8 gap-2 bg-green-50 text-green-600 hover:bg-green-100 border-0'
            }
            onClick={() => onOpenChange(false)}
          >
            <Check className={'w-4 h-4'} />
            Confirm order
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
