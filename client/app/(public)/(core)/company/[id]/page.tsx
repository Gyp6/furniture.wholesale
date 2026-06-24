import { Suspense } from 'react';

import { Metadata } from 'next';
import Company from './company-id';

export const metadata: Metadata = {
  title: 'Company Detail',
};

export default function CompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<div>Завантаження...</div>}>
      <Company params={params} />
    </Suspense>
  );
}

