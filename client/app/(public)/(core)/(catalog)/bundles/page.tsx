import { Metadata } from 'next';

import { CatalogBundlesPage } from '@/components/pages/core/catalog/catalog-bundles';

export const metadata: Metadata = {
  title: 'Catalog Bundles',
};

export default function Bundles() {
  return <CatalogBundlesPage />;
}
