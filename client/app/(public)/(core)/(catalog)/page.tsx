import { Metadata } from 'next';

import { CatalogPage } from '@/components/pages/core/catalog';

export const metadata: Metadata = {
  title: 'Catalog',
};

export default function Catalog() {
  return <CatalogPage />;
}
