import { CatalogSidebar } from '@/components/layout';
import {
  BundlesGrid,
  CatalogContent,
  CatalogHeader,
  FilterBadgeGrid,
  Sort,
} from '@/components/sections/core/catalog';

export function CatalogBundlesPage() {
  return (
    <>
      <CatalogHeader title={'Catalog with Prebuilt Bundles'} />

      <div className={'flex flex-col lg:flex-row gap-10 w-full'}>
        <CatalogSidebar />

        <div className={'flex-1 min-w-0'}>
          <div
            className={'flex items-center justify-between mb-6 gap-4 flex-wrap'}
          >
            <FilterBadgeGrid />
            <Sort />
          </div>

          {/* <CatalogContent>
            <BundlesGrid />
          </CatalogContent> */}
        </div>
      </div>
    </>
  );
}
