'use client';

import { Plus } from 'lucide-react';

import { ICONS } from '@/shared/data/icons';

type TBundleItemsToolbarProps = {
  count: number;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  totalPrice: number;
  countTextSize?: string;
};

/** Items counter, per-item quantity stepper and total price of a bundle. */
export function BundleItemsToolbar({
  count,
  quantity,
  onQuantityChange,
  totalPrice,
  countTextSize = 'text-sm',
}: TBundleItemsToolbarProps) {
  return (
    <>
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
          <span className={`${countTextSize} font-bold text-secondary`}>
            {count} ITEMS
          </span>
        </div>

        <div className={'flex items-center gap-3'}>
          <div
            className={
              'flex items-center gap-3 bg-secondary/10 rounded-full px-4 py-2'
            }
          >
            <button
              onClick={() => onQuantityChange(Math.max(0, quantity - 1))}
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
              onClick={() => onQuantityChange(quantity + 1)}
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
    </>
  );
}

/** Dashed tile that opens the "create item" flow. */
export function NewItemTile({ onClick }: { onClick?: () => void }) {
  return (
    <div
      className={
        'flex flex-col items-center justify-center gap-2 rounded-[40px] border-2 border-dashed border-neutral-200 bg-secondary/5 cursor-pointer hover:bg-secondary/10 transition-colors'
      }
      onClick={onClick}
      style={{ width: '336px', height: '556px' }}
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
  );
}
