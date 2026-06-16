import { CompanyProfilePage } from '@/components/pages/core/company/company-profile';
import { Suspense } from 'react';

export default function CompanyPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<div>Завантаження...</div>}>
      <CompanyProfilePage params={params} />
    </Suspense>
  );
}
