'use client';

import { Button } from '@/components/ui/shadcn/button';
import { ICONS } from '@/shared/data/icons';

type TBundleEditHeaderProps = {
  hasChanges: boolean;
};

export function BundleEditHeader({ hasChanges }: TBundleEditHeaderProps) {
  return (
    <div className={'flex items-center justify-between'}>
      <h1 className={'text-3xl font-bold'}>Edit Space Bundle</h1>
      <div className={'flex items-center gap-3'}>
        <Button
          variant={'outline'}
          className={'rounded-full h-11 px-6 text-sm'}
        >
          Cancel
        </Button>
        <Button
          variant={'default'}
          className={`rounded-full h-11 px-6 text-sm gap-2 ${!hasChanges ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={!hasChanges}
        >
          <ICONS.Bundles
            size={16}
            color={'currentColor'}
          />
          Publish Space Bundle
        </Button>
      </div>
    </div>
  );
}
