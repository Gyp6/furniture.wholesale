import { Suspense } from 'react';

import { CatalogSidebar } from '@/components/layout';
import {
  CatalogHeader,
  FilterBadgeGrid,
  ProductGrid,
  ProductGridSkeleton,
  Sort,
} from '@/components/sections/core/catalog';

export function CatalogPage() {
  return (
    <>
      <CatalogHeader />

      <div className={'flex flex-col lg:flex-row gap-10 w-full'}>
        <CatalogSidebar />

        <div className={'flex-1 min-w-0'}>
          <div
            className={'flex items-center justify-between mb-6 gap-4 flex-wrap'}
          >
            <FilterBadgeGrid />
            <Sort />
          </div>

          <Suspense fallback={<ProductGridSkeleton />}>
            <ProductGrid />
          </Suspense>

          <div
            className={
              'flex items-center justify-between mt-12 text-xs text-muted-foreground'
            }
          >
            <span>Page 01 — 24</span>
            <div className={'flex items-center gap-2'}>
              <button
                className={
                  'w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-100'
                }
              >
                ‹
              </button>
              <button
                className={
                  'w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center'
                }
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
