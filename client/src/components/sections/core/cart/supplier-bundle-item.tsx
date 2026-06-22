'use client';

import Image from 'next/image';

import { ROUTES } from '@/constants';
import { ICONS } from '@/shared/data/icons';
import { IBundle } from '@/shared/types';

interface SupplierBundleItemProps {
  bundle: IBundle;
  quantity: number;
  priceSnapshot: number;
  onDelete: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

export function SupplierBundleItem({
  bundle,
  quantity,
  priceSnapshot,
  onDelete,
  onUpdateQuantity,
}: SupplierBundleItemProps) {
  const totalPrice = priceSnapshot * quantity;

  return (
    <div
      className={
        'bg-white rounded-[40px] border border-neutral-100 p-8 flex flex-col gap-8 shadow-[0_8px_40px_rgba(0,0,0,0.04)]'
      }
    >
      {/* Bundle Header */}
      <div
        className={
          'flex flex-col md:flex-row md:items-center justify-between gap-6'
        }
      >
        <div className={'flex flex-col gap-1'}>
          <div className={'flex items-center gap-3'}>
            <h3 className={'text-2xl font-bold'}>{bundle.name}</h3>
            <span
              className={
                'bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full'
              }
            >
              {bundle.items.length} Items
            </span>
          </div>
          <p className={'text-muted-foreground'}>
            {bundle.items?.[0]?.product?.manufacturer?.name ||
              'Noble Furniture Co.'}
          </p>
        </div>

        <div className={'flex items-center gap-8'}>
          <div className={'flex flex-col items-end gap-1'}>
            <span
              className={
                'text-[10px] uppercase tracking-widest text-muted-foreground font-bold'
              }
            >
              Total Price
            </span>
            <span className={'text-2xl font-bold'}>
              $
              {totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span>
          </div>

          <div className={'flex items-center gap-6'}>
            <div
              className={
                'flex items-center gap-4 bg-secondary/10 rounded-full px-5 py-2.5'
              }
            >
              <button
                onClick={() => onUpdateQuantity(Math.max(1, quantity - 1))}
                className={
                  'text-secondary font-bold text-lg hover:opacity-70 transition-opacity'
                }
              >
                −
              </button>
              <span
                className={'text-base font-bold w-6 text-center text-secondary'}
              >
                {String(quantity).padStart(2, '0')}
              </span>
              <button
                onClick={() => onUpdateQuantity(quantity + 1)}
                className={
                  'text-secondary font-bold text-lg hover:opacity-70 transition-opacity'
                }
              >
                +
              </button>
            </div>

            <button
              onClick={onDelete}
              className={
                'w-11 h-11 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors'
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
      </div>

      <div className={'border-t border-neutral-100'} />

      {/* Bundle Items Grid */}
      <div
        className={
          'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6'
        }
      >
        {bundle.items.map((item, idx) => {
          if (!item.product) return null;
          return (
            <div
              key={idx}
              className={'flex flex-col gap-3'}
            >
              <div
                className={
                  'relative aspect-square rounded-[24px] overflow-hidden bg-neutral-50 border border-neutral-100'
                }
              >
                <Image
                  src={
                    item.product.images?.[0]
                      ? item.product.images[0].startsWith('http')
                        ? item.product.images[0]
                        : ROUTES.S3(item.product.images[0])
                      : '/placeholder.png'
                  }
                  alt={item.product.title}
                  fill
                  className={'object-cover'}
                  unoptimized
                />
                <div
                  className={
                    'absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-[10px] font-bold shadow-sm'
                  }
                >
                  x{item.quantity}
                </div>
              </div>
              <div className={'flex flex-col gap-0.5 px-1'}>
                <h4 className={'text-xl font-bold line-clamp-1'}>
                  {item.product.title}
                </h4>
                <p className={'text-base text-muted-foreground'}>
                  {item.product.manufacturer.name}
                </p>
                <div className={'flex items-center justify-between mt-1'}>
                  <span className={'text-lg font-bold'}>
                    ${item.priceSnapshot.toLocaleString()}
                  </span>
                  <span className={'text-base text-muted-foreground'}>
                    min. {item.product.minSellUnits}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
