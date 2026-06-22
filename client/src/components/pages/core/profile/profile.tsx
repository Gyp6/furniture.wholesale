'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import {
  BrandIdentity,
  BusinessTerms,
  ProfileHeader,
  ProfilePreview,
} from '@/components/sections/core/profile';
import { Button } from '@/components/ui/shadcn/button';
import { Skeleton } from '@/components/ui/shadcn/skeleton';
import { useGetMe, useUpdateCompany } from '@/hooks/queries';

export interface CompanyProfileEditState {
  name: string;
  description: string;
  businessEmail: string;
  showroomAddress: string;
  specializations: string[];
  leadTime: string;
  terms: string;
}

export function ProfilePage() {
  const { data: user, isLoading } = useGetMe();
  const { mutate: updateCompany, isPending: isUpdating } = useUpdateCompany();

  const company = user?.profile?.company;

  const [formData, setFormData] = useState<CompanyProfileEditState>({
    name: '',
    description: '',
    businessEmail: '',
    showroomAddress: '',
    specializations: [],
    leadTime: '',
    terms: '',
  });

  useEffect(() => {
    if (company) {
      setFormData({
        name: company.name || '',
        description: company.description || '',
        businessEmail: company.businessEmail || '',
        showroomAddress: company.showroomAddress || '',
        specializations: company.specializations || [],
        leadTime: company.leadTime || '',
        terms: company.terms || '',
      });
    }
  }, [company]);

  const handleFieldChange = (updates: Partial<CompanyProfileEditState>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const handlePublish = () => {
    updateCompany(formData, {
      onSuccess: () => {
        toast.success('Company profile updated successfully!');
      },
      onError: () => {
        toast.error('Failed to update company profile.');
      },
    });
  };

  const handleDiscard = () => {
    if (company) {
      setFormData({
        name: company.name || '',
        description: company.description || '',
        businessEmail: company.businessEmail || '',
        showroomAddress: company.showroomAddress || '',
        specializations: company.specializations || [],
        leadTime: company.leadTime || '',
        terms: company.terms || '',
      });
      toast.info('Changes discarded.');
    }
  };

  if (isLoading) {
    return (
      <div
        className={'min-h-screen w-full bg-secondary/10 px-10 py-10 pt-[94px]'}
      >
        <div className={'flex gap-10'}>
          <div className={'flex-1 flex flex-col gap-6'}>
            <Skeleton className={'h-20 w-1/3 rounded-xl'} />
            <Skeleton className={'h-96 w-full rounded-3xl'} />
            <Skeleton className={'h-48 w-full rounded-3xl'} />
          </div>
          <div className={'w-[413px] shrink-0 flex flex-col gap-4'}>
            <Skeleton className={'h-[400px] w-full rounded-[30px]'} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={'min-h-screen w-full bg-secondary/10 px-10 py-10 pt-[94px]'}
    >
      <div className={'flex gap-10'}>
        <div className={'flex-1 flex flex-col gap-6'}>
          <ProfileHeader />
          <BrandIdentity
            formData={formData}
            onChange={handleFieldChange}
            companyTaxCode={company?.taxCode}
          />
          <BusinessTerms
            formData={formData}
            onChange={handleFieldChange}
          />
        </div>

        <div className={'w-[413px] shrink-0 flex flex-col gap-4 pt-2'}>
          <div className={'bg-white rounded-[30px] p-6'}>
            <ProfilePreview
              formData={formData}
              companyTaxCode={company?.taxCode}
            />
          </div>
          <div className={'flex items-center gap-3'}>
            <Button
              variant={'outline'}
              className={'rounded-full h-11 text-sm'}
              style={{ width: '197px' }}
              onClick={handleDiscard}
              disabled={isUpdating}
            >
              Discard Changes
            </Button>
            <Button
              variant={'default'}
              className={'rounded-full h-11 text-sm'}
              style={{ width: '197px' }}
              onClick={handlePublish}
              disabled={isUpdating}
            >
              {isUpdating ? 'Publishing...' : 'Publish Updates'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
