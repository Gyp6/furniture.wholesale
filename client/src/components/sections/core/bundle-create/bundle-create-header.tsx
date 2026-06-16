'use client';

import { Button } from '@/components/ui/shadcn/button';
import { ICONS } from '@/shared/data/icons';

type TBundleCreateHeaderProps = {
  itemsCount: number;
};

export function BundleCreateHeader({ itemsCount }: TBundleCreateHeaderProps) {
  const canPublish = itemsCount >= 2;

  const handlePublish = () => {
    if (!canPublish) {
      alert('Please add at least 2 items to publish your bundle.');
      return;
    }
  };

  return (
    <div className={'flex items-center justify-between'}>
      <h1 className={'text-3xl font-bold'}>Create new Space Bundle</h1>
      <div className={'flex items-center gap-3'}>
        <Button
          variant={'outline'}
          className={'rounded-full h-11 px-6 text-sm'}
        >
          Cancel
        </Button>
        <Button
          variant={'default'}
          className={`rounded-full h-11 px-6 text-sm gap-2 ${!canPublish ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={handlePublish}
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
