'use client';

import { Separator } from '@shadcn/separator';
import { useState } from 'react';

import { Pagination } from '@/components/ui/pagination';
import { CatalogTypes } from '@/constants';
import { useCatalogTypeStore } from '@/store/use-catalog-type.store';

import { BundlesGrid } from './bundles-grid';
import { ProductGrid } from './product-grid';

interface Props {
  isAuthorized: boolean;
}

export function CatalogContent({ isAuthorized }: Props) {
  const { type } = useCatalogTypeStore(state => state);

  const [page, setPage] = useState(1);
  const total = 24;

  return (
    <>
      {type === CatalogTypes.catalog ? (
        <ProductGrid isAuthorized={isAuthorized} />
      ) : (
        <BundlesGrid isAuthorized={isAuthorized} />
      )}
      <Separator className={'my-10'} />

      <Pagination
        currentPage={page}
        totalPages={total}
        onPageChange={newPage => setPage(newPage)}
      />
    </>
  );
}
