'use client';

import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcn/dialog';
import { Button } from '@/components/ui/shadcn/button';
import { ROUTES } from '@/constants';
import { OrderCardData } from '@/shared/data/core/catalog/catalog.data';

type TOutOfStockModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPlaceOrder?: () => void;
};

export function OutOfStockModal({ open, onOpenChange, onPlaceOrder }: TOutOfStockModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded-2xl p-6 flex flex-col gap-5 sm:max-w-[440px]"
        showCloseButton={false}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center hover:bg-neutral-100 transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Out of stock</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">"{OrderCardData.name}"</span> is no longer
          available and has been removed from your bundle.
        </p>

        <div className="flex items-center gap-3 rounded-2xl border border-neutral-100 p-3">
          <div
            className="rounded-xl overflow-hidden shrink-0"
            style={{ width: '150px', height: '150px' }}
          >
            <img
              src={ROUTES.S3('marketplace/table-1.png')}
              alt={OrderCardData.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-sm font-semibold">{OrderCardData.name}</p>
            <p className="text-xs text-muted-foreground">{OrderCardData.vendor}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="outline"
            className="rounded-full h-11 flex-1"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            className="rounded-full h-11 flex-1"
            onClick={onPlaceOrder}
          >
            Place order anyway
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}