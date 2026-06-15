'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/shadcn/button';
import { ROUTES } from '@/constants';
import { useGetProduct } from '@/hooks/queries';
import { useAuthStatus } from '@/hooks/use-auth-status.hook';
import { ICONS } from '@/shared/data/icons';
import { useSpaceBundleStore } from '@/store/use-space-bundle.store';

interface Props {
  id: string;
}

export function ProductDetail({ id }: Props) {
  const router = useRouter();
  const { data: product, isLoading, isLoadingError } = useGetProduct(id);
  const addItem = useSpaceBundleStore(state => state.addItem);
  const { isLoggedIn } = useAuthStatus();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Update state when product data arrives
  const minQty = product?.minSellUnits || 1;
  const currentImage = selectedImage || product?.images?.[0] || '';

  const handleAddToBundle = () => {
    if (product && addItem) {
      addItem({ product, quantity: Math.max(minQty, quantity) });
      toast.success(`${product.title} added to your Space Bundle`);
    }
  };

  if (isLoading)
    return (
      <div className={'p-10 text-center text-muted-foreground'}>
        Loading product...
      </div>
    );

  if (!product || isLoadingError)
    return (
      <div className={'p-10 text-center text-red-500'}>
        Error loading product details
      </div>
    );

  const imgSrc = (src: string) =>
    src.startsWith('http') ? src : ROUTES.S3(src);

  const displayQty = quantity < minQty ? minQty : quantity;

  return (
    <div className={'w-full'}>
      {/* Main Product Section */}
      <div className={'grid grid-cols-1 lg:grid-cols-2 gap-10'}>
        {/* Left: Images */}
        <div className={'flex flex-col gap-4'}>
          <div
            className={
              'rounded-[24px] overflow-hidden bg-neutral-100 w-full aspect-[900/475]'
            }
          >
            <Image
              src={imgSrc(currentImage)}
              alt={product.title}
              width={900}
              height={475}
              unoptimized
              className={'w-full h-full object-cover'}
            />
          </div>

          <div className={'flex gap-3'}>
            {product.images.slice(0, 5).map((img, i) => (
              <button
                key={i}
                onClick={() => setSelectedImage(img)}
                className={`rounded-2xl overflow-hidden shrink-0 transition-all flex-1 aspect-[167/146] min-w-[60px] max-w-[167px] border-2 ${
                  currentImage === img
                    ? 'border-neutral-900 opacity-100'
                    : 'border-transparent opacity-75 hover:opacity-100'
                }`}
              >
                <Image
                  src={imgSrc(img)}
                  alt={`thumb ${i}`}
                  width={167}
                  height={146}
                  unoptimized
                  className={'w-full h-full object-cover'}
                />
              </button>
            ))}
            {product.images.length > 5 && (
              <button
                className={
                  'rounded-2xl border border-neutral-200 bg-neutral-50 flex items-center justify-center text-xs font-medium text-muted-foreground hover:bg-neutral-100 transition-colors shrink-0 flex-1 aspect-[167/146] min-w-[60px] max-w-[167px]'
                }
              >
                +{product.images.length - 5} More
              </button>
            )}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className={'flex flex-col'}>
          <div className={'pb-6'}>
            <h1
              className={
                'text-3xl lg:text-4xl font-normal leading-tight text-neutral-900'
              }
            >
              {product.title}
            </h1>
            {isLoggedIn && (
              <div className={'flex items-baseline gap-2 mt-2'}>
                <span className={'text-3xl font-bold text-neutral-900'}>
                  $
                  {product.price.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
                <span className={'text-sm text-muted-foreground'}>
                  per unit
                </span>
              </div>
            )}
          </div>

          {/* Separator */}
          <div className={'border-t border-neutral-100'} />

          {/* Curator's Description */}
          <div className={'py-6'}>
            <p
              className={
                'text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-400 mb-2'
              }
            >
              Curator's Description
            </p>
            <p className={'text-sm text-neutral-500 leading-relaxed max-w-lg'}>
              {product.description || 'No description provided.'}
            </p>
          </div>

          {/* Separator */}
          <div className={'border-t border-neutral-100'} />

          {/* Quantity + Add to Bundle */}
          <div className={'py-6'}>
            {isLoggedIn ? (
              <div className={'flex items-center gap-4'}>
                <div
                  className={
                    'flex items-center rounded-full border border-neutral-200 bg-white shrink-0'
                  }
                >
                  <button
                    onClick={() => setQuantity(Math.max(minQty, quantity - 1))}
                    className={
                      'w-12 h-12 flex items-center justify-center rounded-full hover:bg-neutral-50 text-neutral-500 text-lg transition-colors cursor-pointer'
                    }
                  >
                    −
                  </button>
                  <span
                    className={
                      'w-10 text-center text-sm font-bold text-neutral-900 select-none'
                    }
                  >
                    {String(displayQty).padStart(2, '0')}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.max(minQty, quantity + 1))}
                    className={
                      'w-12 h-12 flex items-center justify-center rounded-full hover:bg-neutral-50 text-neutral-500 text-lg transition-colors cursor-pointer'
                    }
                  >
                    +
                  </button>
                </div>
                <Button
                  className={
                    'flex-1 h-12 rounded-full text-sm font-bold bg-neutral-900 text-white hover:bg-neutral-800 gap-2 cursor-pointer'
                  }
                  onClick={handleAddToBundle}
                >
                  <ICONS.Cart size={16} />
                  Add to Project Bundle
                </Button>
              </div>
            ) : (
              <Button
                className={
                  'w-full h-12 rounded-full text-sm font-bold bg-neutral-100 text-neutral-500 hover:bg-neutral-200 border-0 shadow-none'
                }
                variant={'secondary'}
                disabled
              >
                Register to view pricing & purchase
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Boxes: Technical Specifications + Manufacturer */}
      <div className={'grid grid-cols-1 md:grid-cols-2 gap-5 mt-6'}>
        {/* Technical Specifications */}
        <div
          className={
            'rounded-[20px] border border-neutral-100 bg-white p-6 space-y-5'
          }
        >
          <p
            className={
              'text-[11px] font-bold uppercase tracking-[0.15em] text-neutral-400'
            }
          >
            Technical Specifications
          </p>
          <div className={'grid grid-cols-2 gap-y-5'}>
            <div className={'flex flex-col gap-1'}>
              <span
                className={
                  'text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em]'
                }
              >
                SKU Reference
              </span>
              <span className={'text-sm font-medium text-neutral-800'}>
                {product.sku}
              </span>
            </div>
            <div className={'flex flex-col gap-1'}>
              <span
                className={
                  'text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em]'
                }
              >
                Minimum Order
              </span>
              <span className={'text-sm font-medium text-neutral-800'}>
                {minQty} Units
              </span>
            </div>
            <div className={'flex flex-col gap-1'}>
              <span
                className={
                  'text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em]'
                }
              >
                Dimensions
              </span>
              <span className={'text-sm font-medium text-neutral-800'}>
                {product.dimension.width}W × {product.dimension.depth}D ×{' '}
                {product.dimension.height}H mm
              </span>
            </div>
            <div className={'flex flex-col gap-1'}>
              <span
                className={
                  'text-[10px] font-bold text-neutral-400 uppercase tracking-[0.12em]'
                }
              >
                Lead Time
              </span>
              <span className={'text-sm font-medium text-neutral-800'}>
                {product.leadTime || '6-8 Weeks'}
              </span>
            </div>
          </div>
        </div>

        {/* Manufacturer Info */}
        <div
          className={
            'rounded-[20px] border border-neutral-100 bg-white p-6 flex items-center gap-5'
          }
        >
          {/* Avatar */}
          <div
            className={
              'w-16 h-16 rounded-2xl bg-neutral-900 overflow-hidden shrink-0 flex items-center justify-center'
            }
          >
            <span className={'text-white text-xl font-bold'}>
              {product.manufacturer.name.charAt(0)}
            </span>
          </div>

          {/* Details */}
          <div className={'flex-1 min-w-0'}>
            <div className={'flex items-start justify-between gap-2'}>
              <div>
                <p className={'text-base font-semibold text-neutral-900'}>
                  {product.manufacturer.name}
                </p>
                <p className={'text-xs text-neutral-500 mt-0.5'}>
                  Specialization:{' '}
                  {product.manufacturer.specializations.join(', ') ||
                    'Boutique Hotels & Modern Workspaces'}
                </p>
              </div>
              <div className={'flex items-center gap-1 shrink-0'}>
                {[...Array(Math.round(product.manufacturer.ratingAvg))].map(
                  (_, i) => (
                    <ICONS.StarSolid
                      key={i}
                      size={14}
                      className={'text-yellow-400'}
                    />
                  ),
                )}
              </div>
            </div>
            <div className={'flex items-center gap-4 mt-3'}>
              <button
                className={
                  'text-xs font-semibold text-blue-600 hover:underline cursor-pointer'
                }
                onClick={() =>
                  router.push(`/company/${product.manufacturer.id}`)
                }
              >
                View Full Profile
              </button>
              {product.manufacturer.isVerified && (
                <>
                  <span className={'text-neutral-200'}>|</span>
                  <span
                    className={
                      'text-xs text-neutral-500 flex items-center gap-1'
                    }
                  >
                    <span className={'text-green-500'}>✓</span> Verified
                    Supplier
                  </span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
