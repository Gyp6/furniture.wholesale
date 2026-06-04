'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { ICONS } from '@/shared/data/icons';
import { OrderCard } from '@/components/ui/order-card';
import { OrderCardData } from '@/shared/data/core/catalog/catalog.data';
import { EditItemModal } from './edit-modal';

type TBundleEditItemsProps = {
  onItemsCountChange?: (count: number) => void;
  initialCount?: number;
};

export function BundleEditItems({ onItemsCountChange, initialCount = 10 }: TBundleEditItemsProps) {
  const [items, setItems] = useState<number[]>(
    Array.from({ length: initialCount }, (_, i) => i)
  );
  const [quantity, setQuantity] = useState(8);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const totalPrice = OrderCardData.pricePerUnit * quantity * items.length;

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    onItemsCountChange?.(newItems.length);
  };

  const handleItemClick = (index: number) => {
    setSelectedItem(index);
    setModalOpen(true);
  };

  return (
    <div className="bg-white rounded-[30px] p-6 flex flex-col gap-5">

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-secondary/10 rounded-full px-3 py-1.5">
          <ICONS.Bundles size={14} color="currentColor" className="text-secondary" />
          <span className="text-sm font-bold text-secondary">{items.length} ITEMS</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 bg-secondary/10 rounded-full px-4 py-2">
            <button
              onClick={() => setQuantity(q => Math.max(0, q - 1))}
              className="text-secondary font-bold text-base hover:opacity-70 transition-opacity"
            >
              −
            </button>
            <span className="text-sm font-semibold w-5 text-center text-secondary">
              {String(quantity).padStart(2, '0')}
            </span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="text-secondary font-bold text-base hover:opacity-70 transition-opacity"
            >
              +
            </button>
          </div>

          <button className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors">
            <ICONS.TrashFigma size={14} color="currentColor" className="text-red-500" />
          </button>
        </div>
      </div>

      
      <div className="flex justify-end items-center gap-3">
        <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-semibold">Total Price</span>
        <span className="text-xl font-bold">
          ${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      </div>

      <div className="border-t border-neutral-100" />

      <div className="grid grid-cols-5 gap-5">
        {items.map((_, i) => (
          <OrderCard
            key={i}
            name={OrderCardData.name}
            vendor={OrderCardData.vendor}
            category={OrderCardData.category}
            minPieces={OrderCardData.minPieces}
            pricePerUnit={OrderCardData.pricePerUnit}
            quantity={OrderCardData.quantity}
            image={OrderCardData.image}
            onDelete={() => removeItem(i)}
            onImageClick={() => handleItemClick(i)}
          />
        ))}

      
        <div
          className="flex flex-col items-center justify-center gap-2 rounded-[40px] border-2 border-dashed border-neutral-200 bg-secondary/5 cursor-pointer hover:bg-secondary/10 transition-colors"
          style={{ width: '336px', height: '556px' }}
        >
          <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
            <Plus className="w-5 h-5 text-secondary" />
          </div>
          <span className="text-xs font-medium text-muted-foreground">Create new item</span>
        </div>
      </div>

      <EditItemModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={() => setModalOpen(false)}
        onDiscard={() => setModalOpen(false)}
      />
    </div>
  );
}