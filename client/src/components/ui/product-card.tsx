'use client';

import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/shadcn/badge';
import { Button } from '@/components/ui/shadcn/button';
import { Card, CardContent } from '@/components/ui/shadcn/card';
import { ROUTES } from '@/constants';
import { IProduct } from '@/shared/types';
import { useSpaceBundleStore } from '@/store/use-space-bundle.store';

type TProductCardProps = {
  isAuthorized: boolean;
  product: IProduct;
};

export function ProductCard({ isAuthorized, product }: TProductCardProps) {
  const addItem = useSpaceBundleStore(state => state.addItem);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddQuick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (addItem) {
      addItem({ product, quantity: product.minSellUnits || 1 });
      toast.success(`${product.title} added to your Space Bundle`);
    }
  };

  const imgSrc = product.images?.[0]
    ? product.images[0].startsWith('http')
      ? product.images[0]
      : ROUTES.S3(product.images[0])
    : '/placeholder.png';

  return (
    <Card
      className={
        'bg-white p-3.5 rounded-[28px] border-0 shadow-md hover:shadow-lg transition-shadow flex flex-col h-full group'
      }
    >
      <Link
        href={ROUTES.PRODUCT(product.id)}
        className={'flex flex-col h-full'}
      >
        <div
          className={
            'relative w-full aspect-square overflow-hidden rounded-[20px] shrink-0 bg-neutral-50'
          }
        >
          <Image
            src={imgSrc}
            alt={product.title}
            className={
              'w-full h-full object-cover transition-transform duration-300 group-hover:scale-102'
            }
            width={300}
            height={300}
            unoptimized
          />
          {/* Category Badge overlay on top-left */}
          <Badge
            className={
              'absolute top-3 left-3 bg-white text-neutral-700 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm border-0 select-none hover:bg-white'
            }
          >
            {product.spaces?.[0]?.title || 'Furniture'}
          </Badge>

          {/* Heart Icon button overlay on top-right */}
          {/* <button
            onClick={handleToggleFavorite}
            className={cn(
              'absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm cursor-pointer border-0 hover:scale-105 transition-all outline-none',
              isFavorite ? 'text-red-500' : 'text-neutral-400 hover:text-red-400',
            )}
          >
            <Heart
              className={'w-4.5 h-4.5'}
              fill={isFavorite ? 'currentColor' : 'none'}
            />
          </button> */}
        </div>

        <div className={'flex flex-col flex-1 mt-3 justify-between'}>
          <div className={'space-y-0.5'}>
            <h3
              className={
                'text-base font-bold text-neutral-900 leading-snug line-clamp-2 select-text'
              }
            >
              {product.title}
            </h3>
            <p className={'text-xs text-neutral-400 font-medium'}>
              {product.manufacturer?.name || 'Noble Furniture Co.'}
            </p>
          </div>

          <CardContent className={'p-0 mt-4'}>
            {isAuthorized ? (
              <div className={'flex flex-col gap-3'}>
                <div className={'flex items-baseline justify-between gap-2'}>
                  <p
                    className={
                      'text-xs text-neutral-400 font-semibold select-none'
                    }
                  >
                    min. {product.minSellUnits || 1} pieces
                  </p>
                  <span className={'text-lg font-extrabold text-neutral-950'}>
                    ${new Intl.NumberFormat('en-US').format(product.price)}
                  </span>
                </div>
                <Button
                  className={
                    'w-full h-11 rounded-full text-sm font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 border-0 shadow-none transition-all flex items-center justify-center gap-1.5 cursor-pointer'
                  }
                  variant={'default'}
                  onClick={handleAddQuick}
                >
                  <Plus className={'w-4 h-4'} /> Add to Bundle
                </Button>
              </div>
            ) : (
              <div className={'flex flex-col gap-3'}>
                <div className={'flex items-baseline justify-between'}>
                  <p
                    className={
                      'text-xs text-neutral-400 font-semibold select-none'
                    }
                  >
                    min. {product.minSellUnits || 1} pieces
                  </p>
                </div>
                <Link
                  href={ROUTES.AUTH.REGISTER}
                  className={'w-full'}
                >
                  <Button
                    className={
                      'w-full h-11 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-500 hover:bg-neutral-200 border-0 shadow-none transition-colors'
                    }
                    variant={'secondary'}
                  >
                    Price available after registration
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </div>
      </Link>
    </Card>
  );
}
