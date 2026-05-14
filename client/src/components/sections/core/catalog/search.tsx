'use client';

import { Search } from 'lucide-react';

import { Button } from '@/components/ui/shadcn/button';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/shadcn/input-group';

export function CatalogSearch() {
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
      >
        View prebuilt Bundles
      </Button>
    </div>
  );
}
