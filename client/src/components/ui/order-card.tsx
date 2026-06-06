'use client';

import Image from 'next/image';
import { useState } from 'react';

import { Badge } from '@/components/ui/shadcn/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/shadcn/card';
import { ICONS } from '@/shared/data/icons';

type TOrderCardProps = {
  name: string;
  vendor: string;
  category: string;
  minPieces: number;
  pricePerUnit: number;
  quantity: number;
  image: string;
  onDelete?: () => void;
  onImageClick?: () => void;
};

export function OrderCard({
  name,
  vendor,
  category,
  minPieces,
  pricePerUnit,
  quantity: initialQuantity,
  image,
  onDelete,
  onImageClick,
}: TOrderCardProps) {
  const [quantity, setQuantity] = useState(initialQuantity);

  const totalPrice = pricePerUnit * quantity;

  return (
    <Card
      className={
        'flex flex-col ring-0 border border-neutral-100 gap-0 p-[10px] rounded-[40px] shadow-[0_8px_40px_rgba(0,0,0,0.08)]'
      }
    >
      <div className={'relative rounded-[30px] overflow-hidden'}>
        <Image
          src={image}
          alt={name}
          className={`w-full aspect-square object-cover ${onImageClick ? 'cursor-pointer' : ''}`}
          width={300}
          height={300}
          unoptimized
          onClick={onImageClick}
        />
        <Badge
          className={
            'absolute top-3 left-3 bg-white text-black text-[15px] font-medium px-3 py-1 rounded-full shadow-sm border-0'
          }
        >
          {category}
        </Badge>
        <button
          onClick={onDelete}
          className={
            'absolute top-3 right-3 w-9 h-9 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors'
          }
        >
          <ICONS.TrashFigma
            size={18}
            color={'currentColor'}
            className={'text-red-500'}
          />
        </button>
      </div>

      <div className={'flex flex-col mt-5 px-2 gap-5'}>
        <CardHeader className={'px-0 pt-0 pb-0 gap-1'}>
          <CardTitle
            variant={'default'}
            size={'default'}
            className={'text-2xl font-bold leading-tight'}
          >
            {name}
          </CardTitle>
          <CardDescription className={'text-s'}>{vendor}</CardDescription>
        </CardHeader>

        <div className={'flex items-center justify-between text-s'}>
          <span className={'text-muted-foreground'}>
            min. {minPieces} pieces
          </span>
          <span className={'text-muted-foreground'}>
            ${new Intl.NumberFormat('en-US').format(pricePerUnit)} per unit
          </span>
        </div>

        <div className={'border-t border-neutral-100'} />

        <CardContent className={'px-0 pb-2'}>
          <div className={'flex items-center justify-between'}>
            <div className={'flex flex-col gap-0.5'}>
              <span
                className={
                  'text-[12px] uppercase tracking-widest text-muted-foreground font-semibold'
                }
              >
                Total Price
              </span>
              <span className={'text-2xl font-bold'}>
                $
                {totalPrice.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            <div
              className={
                'flex items-center gap-3 bg-secondary/10 rounded-full px-4 py-2'
              }
            >
              <button
                onClick={() => setQuantity(q => Math.max(minPieces, q - 1))}
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
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
