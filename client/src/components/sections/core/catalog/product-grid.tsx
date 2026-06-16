'use client';

import { Button } from '@shadcn/button';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@shadcn/empty';
import { Skeleton } from '@shadcn/skeleton';
import { PackageSearch } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

import { ProductCard } from '@/components/ui';
import { IProduct } from '@/shared/types';

interface Props {
  isAuthorized: boolean;
  products?: IProduct[];
  isLoading: boolean;
}

export function ProductGrid({ isAuthorized, products, isLoading }: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const clearAll = () => {
    router.push(pathname, { scroll: false });
  };

  if (isLoading) {
    return (
      <div
        className={
          'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-5'
        }
      >
        {[...Array(10)].map((_, i) => (
          <Skeleton
            key={i}
            className={'h-90 bg-neutral-100 animate-pulse rounded-xl'}
          />
        ))}
      </div>
    );
  }

  if (!products?.length) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant={'icon'}>
            <PackageSearch />
          </EmptyMedia>
          <EmptyTitle>No products found</EmptyTitle>
          <EmptyDescription>
            Try adjusting your filters or search query
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            variant={'outline'}
            onClick={clearAll}
          >
            Reset filters
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <div
      className={
        'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-5'
      }
    >
      {products.map(product => (
        <ProductCard
          key={product.id}
          isAuthorized={isAuthorized}
          product={product}
        />
      ))}
    </div>
  );
}
