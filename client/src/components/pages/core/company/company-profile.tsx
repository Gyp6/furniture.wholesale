'use client';

import { use } from 'react';

import { CompanyBundles } from '@/components/sections/core/company/company-bundles';
import { CompanyHero } from '@/components/sections/core/company/company-hero';
import { Skeleton } from '@/components/ui/shadcn/skeleton';
import { useGetCompany, useGetSupplierBundles } from '@/hooks/queries';

interface Props {
  params: Promise<{ id: string }>;
}

export function CompanyProfilePage({ params }: Props) {
  const { id } = use(params);
  const {
    data: company,
    isLoading: isCompanyLoading,
    error: companyError,
  } = useGetCompany(id);
  const { data: bundles, isLoading: isBundlesLoading } = useGetSupplierBundles({
    companyId: id,
  });

  if (isCompanyLoading) {
    return (
      <div className={'flex flex-col gap-10'}>
        <Skeleton className={'w-full h-[442px]'} />
        <div className={'px-10'}>
          <Skeleton className={'w-48 h-8 mb-6'} />
          <div className={'flex gap-5'}>
            {[...Array(3)].map((_, i) => (
              <Skeleton
                key={i}
                className={'flex-1 h-[300px] rounded-2xl'}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (companyError || !company) {
    return (
      <div className={'p-20 text-center text-red-500 font-bold'}>
        Company not found
      </div>
    );
  }

  return (
    <div className={'flex flex-col'}>
      <CompanyHero company={company} />
      <CompanyBundles
        bundles={bundles || []}
        isLoading={isBundlesLoading}
      />
    </div>
  );
}
