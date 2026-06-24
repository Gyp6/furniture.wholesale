import { use } from 'react';

import { Metadata } from 'next';
import BundleEdit from './bundle-edit';

export const metadata: Metadata = {
  title: 'Bundle Edit',
};

export default function BundleEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  return <BundleEdit id={id} />;
}
