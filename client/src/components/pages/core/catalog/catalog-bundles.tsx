'use client';

import { useState } from 'react';

import { BundlesGrid } from '@/components/sections/core/catalog/bundles-grid';
import { CatalogFooter } from '@/components/sections/core/catalog/catalog-footer';
import { CatalogHeader } from '@/components/sections/core/catalog/catalog-header';

export function CatalogBundlesPage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className={'container mx-auto px-6 py-10'}>
      <CatalogHeader />
      <div className={'mt-[10px]'}>
        <BundlesGrid />
      </div>
      <CatalogFooter
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
