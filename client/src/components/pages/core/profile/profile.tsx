'use client';

import {
  BrandIdentity,
  BusinessTerms,
  ProfileHeader,
  ProfilePreview,
} from '@/components/sections/core/profile';
import { Button } from '@/components/ui/shadcn/button';

export function ProfilePage() {
  return (
    <div
      className={'min-h-screen w-full bg-secondary/10 px-10 py-10 pt-[94px]'}
    >
      <div className={'flex gap-10'}>
        <div className={'flex-1 flex flex-col gap-6'}>
          <ProfileHeader />
          <BrandIdentity />
          <BusinessTerms />
        </div>

        <div className={'w-[413px] shrink-0 flex flex-col gap-4 pt-2'}>
          <div className={'bg-white rounded-[30px] p-6'}>
            <ProfilePreview />
          </div>
          <div className={'flex items-center gap-3'}>
            <Button
              variant={'outline'}
              className={'rounded-full h-11 text-sm'}
              style={{ width: '197px' }}
            >
              Discard Changes
            </Button>
            <Button
              variant={'default'}
              className={'rounded-full h-11 text-sm'}
              style={{ width: '197px' }}
            >
              Publish Updates
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
