'use client';

import { Search } from 'lucide-react';

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

  return (
    <div className={'flex items-center gap-3'}>
      <InputGroup className={'h-10'}>
        <InputGroupAddon>
          <Search />
        </InputGroupAddon>
        <InputGroupInput
          id={'catalog-search-url'}
          placeholder={'Search current catalog...'}
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
