'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcn/dialog';
import { Button } from '@/components/ui/shadcn/button';
import { ROUTES } from '@/constants';
import { ICONS } from '@/shared/data/icons';
import { OrderCardData } from '@/shared/data/core/catalog/catalog.data';

type TEditOrderModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function EditOrderModal({ open, onOpenChange }: TEditOrderModalProps) {
  const [quantity, setQuantity] = useState(8);
  const [stock, setStock] = useState(42);
  const [categories, setCategories] = useState(['Restaurant', 'Cafe']);

  const removeCategory = (cat: string) => {
    setCategories(categories.filter(c => c !== cat));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="rounded-2xl p-6 flex flex-col gap-5 sm:max-w-[560px]"
        showCloseButton={false}
      >
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 w-7 h-7 rounded-full flex items-center justify-center hover:bg-neutral-100 transition-colors"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>

        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">Edit item</DialogTitle>
        </DialogHeader>

        <div className="flex gap-4">
          <div
            className="rounded-2xl border-2 border-dashed border-neutral-200 bg-secondary/5 flex items-center justify-center shrink-0 cursor-pointer hover:bg-secondary/10 transition-colors overflow-hidden"
            style={{ width: '160px', height: '160px' }}
          >
            <img
              src={ROUTES.S3('marketplace/table-1.png')}
              alt="item"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-3 flex-1">
            <div className="flex flex-col gap-1" style={{ width: '328px' }}>
              <span className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground">Name</span>
              <input
                type="text"
                defaultValue={OrderCardData.name}
                className="rounded-full border border-neutral-200 bg-secondary/5 px-4 py-2 text-sm outline-none focus:border-secondary transition-colors"
              />
            </div>

            <div className="flex gap-3 items-end">
              <div className="flex flex-col gap-1" style={{ width: '223px' }}>
                <span className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground">Price</span>
                <input
                  type="text"
                  defaultValue="$1,260"
                  className="rounded-full border border-neutral-200 bg-secondary/5 px-4 py-2 text-sm outline-none focus:border-secondary transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground">MOQ</span>
                <div className="flex items-center gap-2 bg-secondary/10 rounded-full px-3 py-2">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="text-secondary font-bold hover:opacity-70 transition-opacity">−</button>
                  <span className="text-sm font-semibold w-5 text-center text-secondary">{String(quantity).padStart(2, '0')}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="text-secondary font-bold hover:opacity-70 transition-opacity">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground">Category</span>
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <div key={cat} className="flex items-center gap-1.5 bg-neutral-100 rounded-full px-3 py-1.5 text-xs font-medium">
                {cat}
                <button onClick={() => removeCategory(cat)}>
                  <X className="w-3 h-3 text-muted-foreground" />
                </button>
              </div>
            ))}
            <button className="flex items-center gap-1 bg-secondary/10 text-secondary rounded-full px-3 py-1.5 text-xs font-medium hover:bg-secondary/20 transition-colors">
              More +
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-[12px] font-bold uppercase tracking-widest text-muted-foreground">Stock Level</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-secondary/10 rounded-full px-3 py-2">
                <button onClick={() => setStock(s => Math.max(0, s - 1))} className="text-secondary font-bold hover:opacity-70 transition-opacity">−</button>
                <span className="text-sm font-semibold w-6 text-center text-secondary">{stock}</span>
                <button onClick={() => setStock(s => s + 1)} className="text-secondary font-bold hover:opacity-70 transition-opacity">+</button>
              </div>
              <span className="text-sm text-muted-foreground">units</span>
            </div>
          </div>

          <Button
            variant="destructive"
            className="rounded-full h-11 px-6 gap-2 bg-red-50 text-red-500 hover:bg-red-100 border-0"
          >
            <ICONS.TrashFigma size={16} color="currentColor" />
            Delete item
          </Button>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            variant="outline"
            className="rounded-full h-11"
            style={{ width: '195px' }}
            onClick={() => onOpenChange(false)}
          >
            Discard Changes
          </Button>
          <Button
            variant="default"
            className="rounded-full h-11"
            style={{ width: '293px' }}
            onClick={() => onOpenChange(false)}
          >
            Confirm changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}