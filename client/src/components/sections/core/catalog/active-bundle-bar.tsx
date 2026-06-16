'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ROUTES } from '@/constants';
import { useAuthStatus } from '@/hooks/use-auth-status.hook';
import { useSpaceBundleStore } from '@/store';

export function ActiveBundleBar() {
  const { items, totalPrice, name } = useSpaceBundleStore(state => state);
  const { isLoggedIn } = useAuthStatus();
  const pathname = usePathname();

  // Allowed pages for the active bundle bar (pill)
  const isAllowedPage =
    pathname === '/' ||
    pathname === '/catalog' ||
    pathname === '/bundles' ||
    pathname.startsWith('/product/') ||
    pathname.startsWith('/bundle/');

  if (!isLoggedIn || items.length === 0 || !isAllowedPage) return null;

  // Extract thumbnail image sources
  const thumbnails = items
    .map(item => {
      if (item.product?.images?.[0]) return item.product.images[0];
      if (item.nestedBundle?.items?.[0]?.product?.images?.[0]) {
        return item.nestedBundle.items[0].product.images[0];
      }
      return null;
    })
    .filter((img): img is string => !!img);

  const showThumbnails = thumbnails.slice(0, 2);
  const remainingCount = items.length - showThumbnails.length;
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div
      className={
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[600px] px-4 animate-in fade-in slide-in-from-bottom-5 duration-300'
      }
    >
      <div
        className={
          'bg-neutral-950/95 backdrop-blur-md text-white rounded-full shadow-2xl py-3 px-5 flex items-center justify-between gap-4 border border-white/10'
        }
      >
        {/* Left: overlapping thumbnail circles */}
        <div className={'flex items-center gap-3 shrink-0'}>
          <div className={'flex -space-x-3'}>
            {showThumbnails.map((src, idx) => (
              <div
                key={idx}
                className={
                  'w-9 h-9 rounded-full border border-neutral-800 bg-neutral-900 overflow-hidden relative shrink-0'
                }
              >
                <Image
                  src={src.startsWith('http') ? src : ROUTES.S3(src)}
                  alt={`thumbnail ${idx}`}
                  fill
                  className={'object-cover'}
                  unoptimized
                />
              </div>
            ))}
            {remainingCount > 0 && (
              <div
                className={
                  'w-9 h-9 rounded-full bg-blue-600 border border-neutral-950 flex items-center justify-center text-[11px] font-bold text-white shrink-0'
                }
              >
                +{remainingCount}
              </div>
            )}
          </div>

          {/* Details column */}
          <div className={'text-left leading-tight'}>
            <h4
              className={
                'text-xs font-bold text-white uppercase tracking-wider'
              }
            >
              {name || 'Project Bundle #1'}
            </h4>
            <p className={'text-[11px] text-neutral-400 font-medium mt-0.5'}>
              {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'} selected
            </p>
          </div>
        </div>

        {/* Center/Right: Vertical divider + Price */}
        <div className={'flex items-center gap-4'}>
          <div className={'w-px h-6 bg-neutral-800 shrink-0'} />

          <div className={'text-right leading-tight'}>
            <div className={'text-sm font-extrabold text-white'}>
              ${new Intl.NumberFormat('en-US').format(totalPrice)}
            </div>
            <div
              className={
                'text-[9px] text-neutral-400 font-semibold uppercase tracking-wider mt-0.5'
              }
            >
              total price
            </div>
          </div>

          {/* Right: action link button */}
          <Link
            href={'/cart'}
            className={
              'h-9 rounded-full px-4 bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-md active:scale-98 select-none'
            }
          >
            <span>View Bundle</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
