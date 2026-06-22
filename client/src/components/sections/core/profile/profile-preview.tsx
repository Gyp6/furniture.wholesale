'use client';

import { Mail, MapPin } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { CompanyProfileEditState } from '@/components/pages/core/profile/profile';
import { ROUTES } from '@/constants';

interface ProfilePreviewProps {
  formData: CompanyProfileEditState;
  companyTaxCode?: string;
}

export function ProfilePreview({
  formData,
  companyTaxCode,
}: ProfilePreviewProps) {
  const [bannerFailed, setBannerFailed] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);

  const companyBanner = companyTaxCode
    ? ROUTES.S3(`identity/company/${companyTaxCode}/company-cover.png`)
    : null;

  const companyLogo = companyTaxCode
    ? ROUTES.S3(`identity/company/${companyTaxCode}/logo.png`)
    : null;

  return (
    <div className={'flex flex-col gap-4'}>
      <div
        className={
          'rounded-2xl overflow-hidden w-full h-[200px] bg-neutral-100 relative'
        }
      >
        {companyBanner && !bannerFailed ? (
          <Image
            src={companyBanner}
            alt={formData.name || 'Company Profile Preview'}
            className={'w-full h-full object-cover'}
            onError={() => setBannerFailed(true)}
            unoptimized
            fill
          />
        ) : (
          <div
            className={
              'w-full h-full bg-linear-to-br from-secondary/20 to-secondary/5 flex items-center justify-center'
            }
          >
            <span className={'text-sm text-muted-foreground'}>
              No banner uploaded
            </span>
          </div>
        )}
        {companyLogo && !logoFailed && (
          <div
            className={
              'absolute bottom-3 left-3 w-12 h-12 rounded-xl bg-white shadow-lg overflow-hidden'
            }
          >
            <Image
              src={companyLogo}
              alt={'Logo'}
              className={'w-full h-full object-cover'}
              onError={() => setLogoFailed(true)}
              unoptimized
              fill
            />
          </div>
        )}
      </div>

      <div>
        <p className={'text-xl font-bold'}>{formData.name || 'Company Name'}</p>
        <p
          className={
            'text-[12px] uppercase tracking-widest text-muted-foreground mt-0.5'
          }
        >
          {formData.showroomAddress?.split(',').pop()?.trim() ||
            'Location unknown'}
        </p>
      </div>

      <p className={'text-sm text-muted-foreground leading-relaxed'}>
        {formData.description || 'No description provided.'}
      </p>

      <div className={'flex flex-wrap gap-1.5'}>
        {formData.specializations.map(tag => (
          <span
            key={tag}
            className={
              'text-[12px] font-semibold px-2.5 py-1 rounded-full bg-secondary/10 text-secondary'
            }
          >
            {tag}
          </span>
        ))}
      </div>

      <div className={'flex flex-col gap-1'}>
        <p
          className={
            'text-[12px] uppercase tracking-widest text-muted-foreground'
          }
        >
          Lead Time
        </p>
        <p className={'text-sm font-semibold'}>
          {formData.leadTime || '4-8 Weeks'}
        </p>
        {companyTaxCode && (
          <a
            href={ROUTES.S3(
              `identity/company/${companyTaxCode}/terms-of-use.pdf`,
            )}
            target={'_blank'}
            rel={'noopener noreferrer'}
            className={
              'text-sm text-secondary underline underline-offset-2 text-left'
            }
          >
            Company's Terms of Use
          </a>
        )}
        {!companyTaxCode && (
          <button
            className={
              'text-sm text-secondary underline underline-offset-2 text-left'
            }
          >
            Company's Terms of Use
          </button>
        )}
      </div>

      <div className={'flex flex-col gap-2'}>
        <div className={'flex items-center gap-2'}>
          <MapPin className={'w-3.5 h-3.5 text-muted-foreground'} />
          <span className={'text-sm text-muted-foreground'}>
            {formData.showroomAddress || 'Address not provided'}
          </span>
        </div>
        <div className={'flex items-center gap-2'}>
          <Mail className={'w-3.5 h-3.5 text-muted-foreground'} />
          <span className={'text-sm text-muted-foreground'}>
            {formData.businessEmail || 'contact@company.com'}
          </span>
        </div>
      </div>
    </div>
  );
}
