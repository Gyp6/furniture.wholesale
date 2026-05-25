'use client';

import { useState } from 'react';

import { OrderCard } from '@/components/ui/order-card';
import { BundlesTitleSection } from '@/components/ui/title';
import { OrderCardData } from '@/shared/data/core/catalog/catalog.data';
import { ICONS } from '@/shared/data/icons';

type TPrebuiltBundleSectionProps = {
  title?: string;
  vendor?: string;
  description?: string;
  itemsCount?: number;
  pricePerUnit?: number;
  quantity?: number;
};

export function PrebuiltBundleSection({
  title = 'Modern Executive Suite',
  vendor = 'Noble Furniture Co.',
  description = 'A precision-engineered workspace solution combining Scandinavian minimalism with ergonomic excellence.',
  itemsCount = 12,
  pricePerUnit = OrderCardData.pricePerUnit,
  quantity: initialQuantity = 8,
}: TPrebuiltBundleSectionProps) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const totalPrice = pricePerUnit * quantity * itemsCount;

  return (
    <div className={'flex flex-col gap-3'}>
      <BundlesTitleSection title={'Prebuilt Bundles'} />
      <div
        className={
          'bg-white rounded-[60px] p-5 flex flex-col gap-5 shadow-[0_8px_40px_rgba(0,0,0,0.06)]'
        }
      >
        <div className={'flex items-start justify-between gap-5'}>
          <div className={'shrink-0 pt-1'}>
            <div
              className={
                'flex items-center gap-2 bg-secondary/10 rounded-full px-3 py-1.5'
              }
            >
              <ICONS.Bundles
                size={16}
                color={'currentColor'}
                className={'text-secondary'}
              />
              <span className={'text-xs font-bold text-secondary'}>
                {itemsCount} ITEMS
              </span>
            </div>
          </div>

          <div className={'flex-1 text-center'}>
            <h3 className={'text-2xl font-bold'}>{title}</h3>
            <p className={'text-s text-muted-foreground mt-0.5'}>{vendor}</p>
            <p
              className={
                'text-xs text-muted-foreground mt-2 leading-relaxed max-w-[300px] mx-auto'
              }
            >
              {description}
            </p>
          </div>

          <div className={'shrink-0 flex items-center gap-3'}>
            <div
              className={
                'flex items-center gap-3 bg-secondary/10 rounded-full px-4 py-2'
              }
            >
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className={
                  'text-secondary font-bold text-base hover:opacity-70 transition-opacity'
                }
              >
                −
              </button>
              <span
                className={
                  'text-sm font-semibold w-5 text-center text-secondary'
                }
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
                'w-9 h-9 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors'
              }
            >
              <ICONS.TrashFigma
                size={18}
                color={'currentColor'}
                className={'text-red-500'}
              />
            </button>
          </div>
        </div>

        <div className={'border-t border-neutral-100'} />

        <div className={'flex justify-end'}>
          <div className={'flex items-center gap-3'}>
            <span
              className={
                'text-[12px] uppercase tracking-widest text-muted-foreground font-semibold'
              }
            >
              Total Price
            </span>
            <span className={'text-xl font-bold'}>
              $
              {totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>

        <div
          className={
            'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5'
          }
        >
          {[...Array(10)].map((_, i) => (
            <OrderCard
              key={i}
              name={OrderCardData.name}
              vendor={OrderCardData.vendor}
              category={OrderCardData.category}
              minPieces={OrderCardData.minPieces}
              pricePerUnit={OrderCardData.pricePerUnit}
              quantity={OrderCardData.quantity}
              image={OrderCardData.image}
              onDelete={() => console.log('delete', i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
