'use client';

import dynamic from 'next/dynamic';

const CatalogPage = dynamic(
  () => import('@/components/pages/core/catalog/catalog').then(m => ({ default: m.CatalogPage })),
  { ssr: false }
);
export default function Catalog() {
  return <CatalogPage />;
}