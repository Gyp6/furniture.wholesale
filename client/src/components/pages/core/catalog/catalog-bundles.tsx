'use client';

import { useState } from 'react';
import { CatalogHeader } from '@/components/sections/core/catalog/catalog-header';
import { BundlesGrid } from '@/components/sections/core/catalog/bundles-grid';
import { CatalogFooter } from '@/components/sections/core/catalog/catalog-footer';

export function CatalogBundlesPage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="min-h-screen w-full">
      <div className="w-full mx-auto px-10 py-10 flex flex-col gap-5">
        <CatalogHeader />
        <div className="mt-[30px]">
          <BundlesGrid />
        </div>
        <CatalogFooter currentPage={currentPage} onPageChange={setCurrentPage} />
      </div>
    </div>
  );
}