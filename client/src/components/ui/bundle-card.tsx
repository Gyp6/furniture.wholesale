'use client';

import Image from 'next/image';
import Link from 'next/link';

import { Badge } from '@/components/ui/shadcn/badge';
import { Button } from '@/components/ui/shadcn/button';
import { Card } from '@/components/ui/shadcn/card';
import { ROUTES } from '@/constants';
import { ICONS } from '@/shared/data/icons';
import { IBundle } from '@/shared/types';

type TBundleCardProps = {
  isAuthorized: boolean;
  bundle: IBundle;
  onAdd?: (e: React.MouseEvent) => void;
  onClick?: () => void;
  hideButton?: boolean;
};

export function BundleCard({
  isAuthorized,
  bundle,
  onAdd,
  onClick,
  hideButton,
}: TBundleCardProps) {
  // Extract images from bundle items
  const bundleImages = bundle.items
    .map(item => item.product?.images?.[0])
    .filter((img): img is string => !!img)
    .slice(0, 4);

  const imagesToShow = bundleImages.length > 0 ? bundleImages : [];

  const supplierName =
    bundle.items?.[0]?.product?.manufacturer?.name || 'Noble Furniture Co.';

  return (
    <Card
      onClick={onClick}
      className={
        'bg-white flex flex-col sm:flex-row gap-5 p-3.5 rounded-[28px] border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer'
      }
    >
      {/* Left side: 2x2 grid of images of the items in the bundle */}
      <div
        className={
          'relative grid grid-cols-2 grid-rows-2 gap-0.5 rounded-[20px] overflow-hidden shrink-0 w-[200px] h-[200px] mx-auto sm:mx-0 bg-neutral-50'
        }
      >
        {imagesToShow.map((src, i) => (
          <Image
            key={i}
            src={src.startsWith('http') ? src : ROUTES.S3(src)}
            alt={`${bundle.name} item ${i + 1}`}
            className={'w-full h-full object-cover'}
            width={100}
            height={100}
            unoptimized
          />
        ))}
        {imagesToShow.length === 0 && (
          <div
            className={
              'col-span-2 row-span-2 bg-neutral-100 flex items-center justify-center'
            }
          >
            <ICONS.Bundles
              size={40}
              className={'text-neutral-300'}
            />
          </div>
        )}
        <Badge
          className={
            'absolute bottom-2.5 right-2.5 bg-white rounded-full px-2 py-0.5 shadow-sm border-0 text-[10px] font-bold text-neutral-600 hover:bg-white flex items-center gap-1.5'
          }
        >
          <ICONS.Bundles
            size={10}
            color={'currentColor'}
            className={'text-neutral-500'}
          />
          <span>{bundle.items.length} ITEMS</span>
        </Badge>
      </div>

      {/* Right side: details info */}
      <div className={'flex flex-col flex-1 min-w-0 justify-between py-1.5'}>
        <div className={'space-y-0.5'}>
          <h3
            className={
              'text-lg font-bold text-neutral-900 leading-snug line-clamp-1 select-text'
            }
          >
            {bundle.name}
          </h3>
          <p className={'text-xs text-neutral-400 font-medium'}>
            {supplierName}
          </p>
          <p
            className={
              'text-sm text-neutral-500 mt-2 line-clamp-2 leading-relaxed select-text'
            }
          >
            {bundle.description}
          </p>
        </div>

        <div className={'flex flex-col items-end gap-2 mt-4 sm:mt-auto'}>
          {isAuthorized ? (
            <>
              <span className={'text-lg font-extrabold text-neutral-950'}>
                ${new Intl.NumberFormat('en-US').format(bundle.totalPrice)}
              </span>
              {!hideButton && (
                <Button
                  className={
                    'h-11 rounded-full px-5 text-sm font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 border-0 shadow-none transition-all flex items-center justify-center gap-1.5 cursor-pointer'
                  }
                  onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    onAdd?.(e);
                  }}
                >
                  <ICONS.Cart
                    size={16}
                    color={'currentColor'}
                  />
                  Add to your Bundle
                </Button>
              )}
            </>
          ) : (
            <Link
              href={ROUTES.AUTH.REGISTER}
              className={'w-full sm:w-auto'}
              onClick={e => e.stopPropagation()}
            >
              <Button
                className={
                  'w-full h-11 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-500 hover:bg-neutral-200 border-0 shadow-none transition-colors px-5'
                }
                variant={'secondary'}
              >
                Price available after registration
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}
