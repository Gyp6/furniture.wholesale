import type { Metadata } from 'next';
import { Suspense } from 'react';

import { BundleDetailPage } from '@/components/pages/core/bundle.detail/bundle-detail';

export const metadata: Metadata = {
  title: 'Bundle Detail',
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function Bundle({ params }: Props) {
  return (
    <Suspense fallback={<div className="p-10 text-center text-muted-foreground">Loading bundle...</div>}>
      <BundleDetailPage params={params} />
    </Suspense>
  );
}
