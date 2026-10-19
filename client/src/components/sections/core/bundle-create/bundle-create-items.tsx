'use client';

import { useState } from 'react';

import { OrderCard } from '@/components/ui/order-card';
import { OrderCardData } from '@/shared/data/core/catalog/catalog.data';

import {
  BundleItemsToolbar,
  NewItemTile,
} from '../item-form/bundle-items-toolbar';

import { CreateItemModal } from './create-modal';

type TBundleCreateItemsProps = {
  onItemsCountChange: (count: number) => void;
};

export function BundleCreateItems({
  onItemsCountChange,
}: TBundleCreateItemsProps) {
  const [items, setItems] = useState<number[]>([]);
  const [quantity, setQuantity] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const totalPrice = OrderCardData.pricePerUnit * quantity * items.length;

  const addItem = () => {
    const newItems = [...items, items.length];
    setItems(newItems);
    onItemsCountChange(newItems.length);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    onItemsCountChange(newItems.length);
  };

  return (
    <div className={'bg-white rounded-[30px] p-6 flex flex-col gap-5'}>
      <BundleItemsToolbar
        count={items.length}
        quantity={quantity}
        onQuantityChange={setQuantity}
        totalPrice={totalPrice}
        countTextSize={'text-xs'}
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
          />
        ))}

        <NewItemTile onClick={() => setModalOpen(true)} />
      </div>

      <CreateItemModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={() => {
          addItem();
          setModalOpen(false);
        }}
      />
    </div>
  );
}
