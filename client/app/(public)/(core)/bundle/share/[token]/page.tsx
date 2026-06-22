import type { Metadata } from 'next';
import { Suspense } from 'react';

import { SharedBundleDetailPage } from '@/components/pages/core/bundle.detail/shared-bundle-detail';

export const metadata: Metadata = {
  title: 'Shared Project',
};

interface Props {
  params: Promise<{ token: string }>;
}

export default async function SharedBundle({ params }: Props) {
  return (
    <Suspense
      fallback={
        <div className={'p-10 text-center text-muted-foreground'}>
          Loading shared project...
        </div>
      }
    >
      <SharedBundleDetailPage params={params} />
    </Suspense>
  );
}
