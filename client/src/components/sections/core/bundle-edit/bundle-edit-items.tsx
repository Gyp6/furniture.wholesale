'use client';

import { useState } from 'react';

import { OrderCard } from '@/components/ui/order-card';
import { OrderCardData } from '@/shared/data/core/catalog/catalog.data';

import {
  BundleItemsToolbar,
  NewItemTile,
} from '../item-form/bundle-items-toolbar';

import { EditItemModal } from './edit-modal';

type TBundleEditItemsProps = {
  onItemsCountChange?: (count: number) => void;
  initialCount?: number;
};

export function BundleEditItems({
  onItemsCountChange,
  initialCount = 10,
}: TBundleEditItemsProps) {
  const [items, setItems] = useState<number[]>(
    Array.from({ length: initialCount }, (_, i) => i),
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
    <div className={'bg-white rounded-[30px] p-6 flex flex-col gap-5'}>
      <BundleItemsToolbar
        count={items.length}
        quantity={quantity}
        onQuantityChange={setQuantity}
        totalPrice={totalPrice}
      />

      <div className={'border-t border-neutral-100'} />

      <div className={'grid grid-cols-5 gap-5'}>
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

        <NewItemTile />
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
