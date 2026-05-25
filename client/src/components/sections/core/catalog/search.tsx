'use client';

import { Search } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

import { Button } from '@/components/ui/shadcn/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/shadcn/input-group';
import { CatalogTypes } from '@/constants';
import { useCatalogTypeStore } from '@/store/use-catalog-type.store';

export function CatalogSearch() {
  const { type, setType } = useCatalogTypeStore(state => state);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  return (
    <div className={'flex items-center gap-3'}>
      <InputGroup className={'h-10'}>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          id={'catalog-search-url'}
          placeholder={'Search current catalog...'}
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          onKeyDown={handleSearch}
        />
      </InputGroup>
      <Button
        size={'sm'}
        className={'px-6 h-10'}
        variant={'default'}
        onClick={() =>
          setType(
            type === CatalogTypes.catalog
              ? CatalogTypes.bundles
              : CatalogTypes.catalog,
          )
        }
      >
        {type === CatalogTypes.catalog
          ? 'View prebuilt Bundles'
          : 'View single Items'}
      </Button>
    </div>
  );
}
