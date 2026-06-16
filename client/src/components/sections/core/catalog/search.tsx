'use client';

import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/shadcn/button';
import { Input } from '@/components/ui/shadcn/input';
import { CatalogTypes } from '@/constants';
import { useCatalogTypeStore } from '@/store/use-catalog-type.store';

export function CatalogSearch() {
  const { type, setType } = useCatalogTypeStore(state => state);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isBundlesPage = pathname === '/bundles';

  const [searchValue, setSearchValue] = useState(
    searchParams.get('search') || '',
  );

  useEffect(() => {
    setSearchValue(searchParams.get('search') || '');
  }, [searchParams]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams],
  );

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      router.push(`${pathname}?${createQueryString('search', searchValue)}`, {
        scroll: false,
      });
    }
  };

  const handleToggle = () => {
    if (isBundlesPage) {
      setType(CatalogTypes.catalog);
      router.push('/');
    } else {
      setType(CatalogTypes.bundles);
      router.push('/bundles');
    }
  };

  return (
    <div className={'flex items-center gap-4'}>
      <div className={'relative w-[280px]'}>
        <Search
          className={
            'absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground'
          }
        />
        <Input
          placeholder={'Search curated catalog...'}
          className={
            'pl-10 pr-4 h-[56px] text-sm rounded-full bg-white border border-neutral-200 text-foreground placeholder:text-muted-foreground shadow-none focus-visible:ring-1 focus-visible:ring-neutral-300 focus-visible:border-neutral-300'
          }
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          onKeyDown={handleSearch}
        />
      </div>
      <Button
        className={
          'h-[56px] rounded-full px-6 whitespace-nowrap text-sm font-semibold bg-neutral-900 text-white hover:bg-neutral-800 transition-colors'
        }
        variant={'default'}
        onClick={handleToggle}
      >
        {isBundlesPage ? 'View single Items' : 'View prebuilt Bundles'}
      </Button>
    </div>
  );
}
