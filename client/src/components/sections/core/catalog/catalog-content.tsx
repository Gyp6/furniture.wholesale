'use client';

import { Separator } from '@shadcn/separator';
import { useState } from 'react';

import { Pagination } from '@/components/ui/pagination';

import { ProductGrid } from './product-grid';

export function CatalogContent({ isAuthorized }: { isAuthorized: boolean }) {
  const [page, setPage] = useState(1);
  const total = 24;

  return (
    <>
      <ProductGrid isAuthorized={isAuthorized} />

      <Separator className={'my-10'} />

      <Pagination
        currentPage={page}
        totalPages={total}
        onPageChange={newPage => setPage(newPage)}
      />
    </>
  );
}
