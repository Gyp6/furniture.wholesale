import { CatalogSidebar } from '@/components/layout';
import {
  BundlesGrid,
  CatalogHeader,
  FilterBadgeGrid,
  Sort,
} from '@/components/sections/core/catalog';
import { getServerSession } from '@/services/session.service';

export async function CatalogBundlesPage() {
  const { session } = (await getServerSession()) || {};
  const isAuthorized = !!session;

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
            <div></div>
            <Sort />
          </div>

          <BundlesGrid isAuthorized={isAuthorized} />
        </div>
      </div>
    </>
  );
}
