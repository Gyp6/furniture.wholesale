'use client';

import Image from 'next/image';

import { Button } from '@/components/ui/shadcn/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcn/dialog';
import { ICONS } from '@/shared/data/icons';
import { IBundle } from '@/shared/types';
import { ROUTES } from '@/constants';

const getProductImage = (images?: string[]) => {
  const image = images?.[0];
  if (!image) return '/placeholder.png';
  return image.startsWith('http') ? image : ROUTES.S3(image);
};


interface Props {
  bundle: IBundle | null;
  isOpen: boolean;
  onClose: () => void;
  onAdd?: (bundle: IBundle) => void;
  isAuthorized: boolean;
}

export function BundleDetailModal({
  bundle,
  isOpen,
  onClose,
  onAdd,
  isAuthorized,
}: Props) {
  if (!bundle) return null;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent
        className={
          'max-w-4xl max-h-[90vh] overflow-y-auto rounded-[30px] p-0 border-none bg-white'
        }
      >
        <div className={'flex flex-col lg:flex-row h-full'}>
          {/* Left Side: Images */}
          <div className={'lg:w-1/2 bg-neutral-50 p-6 flex flex-col gap-4'}>
            <div
              className={'aspect-square rounded-3xl overflow-hidden bg-white'}
            >
              {bundle.items?.[0]?.product?.images?.[0] ? (
                <Image
                  src={getProductImage(bundle.items[0].product.images)}
                  alt={bundle.name}
                  width={500}
                  height={500}
                  className={'w-full h-full object-cover'}
                  unoptimized
                />
              ) : (
                <div
                  className={
                    'w-full h-full flex items-center justify-center text-neutral-300'
                  }
                >
                  <ICONS.Bundles size={80} />
                </div>
              )}
            </div>
            <div className={'grid grid-cols-4 gap-2'}>
              {bundle.items.slice(1, 5).map((item, i) => (
                <div
                  key={i}
                  className={
                    'aspect-square rounded-xl overflow-hidden bg-white'
                  }
                >
                  {item.product?.images?.[0] && (
                    <Image
                      src={getProductImage(item.product.images)}
                      alt={`Item ${i}`}
                      width={100}
                      height={100}
                      className={'w-full h-full object-cover'}
                      unoptimized
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right Side: Details */}
          <div className={'lg:w-1/2 p-8 flex flex-col'}>
            <DialogHeader className={'mb-6'}>
              <div className={'flex items-center gap-2 mb-2'}>
                <span
                  className={
                    'bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full'
                  }
                >
                  Supplier Bundle
                </span>
                <span className={'text-muted-foreground text-xs font-medium'}>
                  {bundle.items.length} Items Included
                </span>
              </div>
              <DialogTitle className={'text-3xl font-bold leading-tight'}>
                {bundle.name}
              </DialogTitle>
              <p className={'text-primary font-medium mt-1'}>
                {bundle.items?.[0]?.product?.manufacturer?.name ||
                  'Noble Furniture Co.'}
              </p>
            </DialogHeader>

            <div className={'flex-1'}>
              <h4
                className={
                  'text-[12px] font-bold uppercase tracking-widest text-muted-foreground mb-3'
                }
              >
                Included in this Bundle
              </h4>
              <div
                className={
                  'space-y-4 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar'
                }
              >
                {bundle.items.map(item => (
                  <div
                    key={item.id}
                    className={'flex items-center gap-4 group'}
                  >
                    <div
                      className={
                        'w-16 h-16 rounded-2xl bg-neutral-100 overflow-hidden shrink-0'
                      }
                    >
                      {item.product?.images?.[0] && (
                        <Image
                          src={getProductImage(item.product.images)}
                          alt={item.product.title}
                          width={64}
                          height={64}
                          className={'w-full h-full object-cover'}
                          unoptimized
                        />
                      )}
                    </div>
                    <div className={'flex-1 min-w-0'}>
                      <p className={'text-sm font-bold truncate'}>
                        {item.product?.title}
                      </p>
                      <p className={'text-xs text-muted-foreground'}>
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <div className={'text-right'}>
                      <p className={'text-sm font-bold'}>
                        ${item.priceSnapshot.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className={'bg-neutral-50 rounded-3xl p-6 mb-8'}>
                <div className={'flex items-center justify-between mb-1'}>
                  <span className={'text-sm text-muted-foreground font-medium'}>
                    Total Value
                  </span>
                  <span className={'text-2xl font-bold'}>
                    ${bundle.totalPrice.toLocaleString()}
                  </span>
                </div>
                <p className={'text-[10px] text-muted-foreground'}>
                  * This bundle offers a 12% discount compared to individual
                  items
                </p>
              </div>
            </div>

            <div className={'mt-auto'}>
              {isAuthorized ? (
                <Button
                  className={
                    'w-full h-14 rounded-full text-base font-bold gap-2'
                  }
                  onClick={() => onAdd?.(bundle)}
                >
                  <ICONS.Cart size={20} />
                  Add Bundle to My Project
                </Button>
              ) : (
                <Button
                  variant={'secondary'}
                  className={
                    'w-full h-14 rounded-full text-base font-bold bg-neutral-200'
                  }
                  disabled
                >
                  Register to Purchase
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
