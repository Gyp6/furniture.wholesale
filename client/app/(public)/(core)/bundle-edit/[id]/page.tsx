import { use } from 'react';

import { BundleEditPage } from '@/components/pages/core/bundle-edit/bundle-edit';

export default function BundleEdit({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <BundleEditPage bundleId={id} />;
}
