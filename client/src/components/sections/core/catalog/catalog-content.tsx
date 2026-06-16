'use client';

import { Separator } from '@shadcn/separator';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Pagination } from '@/components/ui/pagination';
import { CatalogTypes } from '@/constants';
import { useGetProducts } from '@/hooks/queries';
import { useCatalogTypeStore } from '@/store/use-catalog-type.store';

import { BundlesGrid } from './bundles-grid';
import { ProductGrid } from './product-grid';

interface Props {
  isAuthorized: boolean;
}

export function CatalogContent({ isAuthorized }: Props) {
  const { type } = useCatalogTypeStore(state => state);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const params = {
    search: searchParams.get('search') || undefined,
    categories: searchParams.get('categories')?.split(',').filter(Boolean),
    spaces: searchParams.get('spaces')?.split(',').filter(Boolean),
    tags: searchParams.get('tags')?.split(',').filter(Boolean),
    minPrice: Number(searchParams.get('minPrice')) || undefined,
    maxPrice: Number(searchParams.get('maxPrice')) || undefined,
    sort: searchParams.get('sort') || undefined,
    page: Number(searchParams.get('page')) || 1,
    limit: 10,
  };

  const { data: response, isLoading } = useGetProducts(params);

  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set('page', newPage.toString());
    router.push(`${pathname}?${newParams.toString()}`, { scroll: false });
  };

  return (
    <>
      {type === CatalogTypes.catalog ? (
        <ProductGrid
          isAuthorized={isAuthorized}
          products={response?.items}
          isLoading={isLoading}
        />
      ) : (
        <BundlesGrid isAuthorized={isAuthorized} />
      )}
      <Separator className={'my-10'} />

      {response && response.totalPages > 1 && (
        <Pagination
          currentPage={response.page}
          totalPages={response.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
}
