'use client';

import { Mail, MapPin, Star } from 'lucide-react';
import { ROUTES } from '@/constants';
import { ICompany } from '@/shared/types';
import Image from 'next/image';

interface CompanyHeroProps {
  company: ICompany;
}

export function CompanyHero({ company }: CompanyHeroProps) {
  const companyBanner = company.taxCode
    ? ROUTES.S3(`identity/company/${company.taxCode}/banner.png`)
    : null;

  const companyLogo = company.taxCode
    ? ROUTES.S3(`identity/company/${company.taxCode}/logo.png`)
    : null;

  return (
    <div
      className={'relative w-full overflow-hidden'}
      style={{ height: '442px' }}
    >
      {companyBanner ? (
          <img
            src={companyBanner}
            alt={company.name || 'Company Profile Preview'}
            className={'w-full h-full object-cover'}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-secondary/20 to-secondary/5 flex items-center justify-center">
            <span className="text-sm text-muted-foreground">No banner uploaded</span>
          </div>
        )}

      {/* Company Brand Card */}
      <div
        className={
          'absolute bottom-6 left-10 bg-white rounded-2xl p-4 flex items-center gap-4 shadow-lg border border-neutral-100'
        }
        style={{ width: '457px', height: '136px' }}
      >
        {companyLogo ? (
            <div
            className={
              'rounded-xl flex items-center justify-center shrink-0 overflow-hidden'
            }
            style={{ width: '120px', height: '120px' }}
            >
            <img
              src={companyLogo}
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div
          className={
            'rounded-xl bg-neutral-500 flex items-center justify-center shrink-0 overflow-hidden'
          }
          style={{ width: '120px', height: '120px' }}
          >
          {/* Logo - for now using abbreviation text */}
              <span className={'text-white text-2xl font-bold uppercase tracking-tighter'}>
                {company.abbreviation || company.name.substring(0, 3)}
              </span>
        </div>
          )}

        <div className={'flex flex-col flex-1 justify-between h-full py-2'}>
          <div>
            <h1 className={'text-2xl font-bold text-neutral-900 leading-tight'}>
              {company.name}
            </h1>
            <p className={'text-xs uppercase tracking-widest text-neutral-400 font-bold mt-1'}>
              {company.showroomAddress?.split(',').pop()?.trim() || 'Location unknown'}
            </p>
          </div>
          <div className={'flex items-center gap-0.5 mt-auto'}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < parseFloat(company.ratingAvg)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'fill-neutral-200 text-neutral-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div
        className={
          'absolute right-10 bg-white/95 backdrop-blur-md rounded-[32px] p-8 flex flex-col gap-6 shadow-2xl border border-white/20'
        }
        style={{ width: '413px', height: 'auto', top: '84px' }}
      >
        <p className={'text-sm text-neutral-600 leading-relaxed font-medium'}>
          {company.description || 'No description provided.'}
        </p>

        <div className={'flex flex-wrap gap-2'}>
          {(company.specializations || []).map(tag => (
            <span
              key={tag}
              className={
                'text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-secondary/10 text-secondary'
              }
            >
              {tag}
            </span>
          ))}
        </div>

        <div className={'space-y-4'}>
          <div className={'flex items-center gap-3'}>
            <span className={'text-[10px] font-bold uppercase tracking-widest text-neutral-400'}>
              Lead Time
            </span>
            <span className={'text-sm font-bold text-neutral-900'}>
              {company.leadTime || '4-8 Weeks'}
            </span>
          </div>

          <button className={'text-[10px] font-bold uppercase tracking-widest text-secondary underline underline-offset-4 hover:text-secondary/80 transition-colors text-left w-fit'}>
            Company's Terms of Use
          </button>
        </div>

        <div className={'flex flex-col gap-3 pt-4 border-t border-neutral-100'}>
          <div className={'flex items-start gap-3'}>
            <MapPin className={'w-4 h-4 text-secondary shrink-0 mt-0.5'} />
            <span className={'text-sm text-neutral-600 font-medium'}>
              {company.showroomAddress || 'Address not provided'}
            </span>
          </div>
          <div className={'flex items-center gap-3'}>
            <Mail className={'w-4 h-4 text-secondary shrink-0'} />
            <span className={'text-sm text-neutral-600 font-medium'}>
              {company.businessEmail || 'contact@company.com'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
