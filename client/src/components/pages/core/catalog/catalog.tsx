import { CatalogSidebar } from '@/components/layout/sidebar';
import {
  CatalogContent,
  CatalogHeader,
  FilterBadgeGrid,
  Sort,
} from '@/components/sections/core/catalog';
import { getServerSession } from '@/services';

export async function CatalogPage() {
  const { session } = (await getServerSession()) || {};
  const isAuthorized = !!session;

  return (
    <>
      <CatalogHeader title={'Catalog with Items'} />

      <div className={'flex flex-col lg:flex-row gap-10 w-full'}>
        <CatalogSidebar />

        <div className={'flex-1 min-w-0'}>
          <div
            className={'flex items-center justify-between mb-6 gap-4 flex-wrap'}
          >
            <FilterBadgeGrid />
            <Sort />
          </div>

          <CatalogContent isAuthorized={isAuthorized} />
        </div>
      </div>
    </>
  );
}
