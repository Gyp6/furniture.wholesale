'use client';

import { Plus } from 'lucide-react';
import { useState } from 'react';

import { OrderCard } from '@/components/ui/order-card';
import { OrderCardData } from '@/shared/data/core/catalog/catalog.data';
import { ICONS } from '@/shared/data/icons';

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
      <div className={'flex items-center justify-between'}>
        <div
          className={
            'flex items-center gap-2 bg-secondary/10 rounded-full px-3 py-1.5'
          }
        >
          <ICONS.Bundles
            size={14}
            color={'currentColor'}
            className={'text-secondary'}
          />
          <span className={'text-xs font-bold text-secondary'}>
            {items.length} ITEMS
          </span>
        </div>

        <div className={'flex items-center gap-3'}>
          <div
            className={
              'flex items-center gap-3 bg-secondary/10 rounded-full px-4 py-2'
            }
          >
            <button
              onClick={() => setQuantity(q => Math.max(0, q - 1))}
              className={
                'text-secondary font-bold text-base hover:opacity-70 transition-opacity'
              }
            >
              −
            </button>
            <span
              className={'text-sm font-semibold w-5 text-center text-secondary'}
            >
              {String(quantity).padStart(2, '0')}
            </span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className={
                'text-secondary font-bold text-base hover:opacity-70 transition-opacity'
              }
            >
              +
            </button>
          </div>

          <button
            className={
              'w-8 h-8 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors'
            }
          >
            <ICONS.TrashFigma
              size={14}
              color={'currentColor'}
              className={'text-red-500'}
            />
          </button>
        </div>
      </div>

      <div className={'flex justify-end items-center gap-3'}>
        <span
          className={
            'text-[10px] uppercase tracking-widest text-muted-foreground font-semibold'
          }
        >
          Total Price
        </span>
        <span className={'text-xl font-bold'}>
          ${totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </span>
      </div>

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

        <div
          className={
            'flex flex-col items-center justify-center gap-2 rounded-[40px] border-2 border-dashed border-neutral-200 bg-secondary/5 cursor-pointer hover:bg-secondary/10 transition-colors'
          }
          style={{ width: '336px', height: '556px' }}
          onClick={() => setModalOpen(true)}
        >
          <div
            className={
              'w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center'
            }
          >
            <Plus className={'w-5 h-5 text-secondary'} />
          </div>
          <span className={'text-xs font-medium text-muted-foreground'}>
            Create new item
          </span>
        </div>
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
