import { Mail, MapPin, Star } from 'lucide-react';
import Image from 'next/image';

import { ROUTES } from '@/constants';
import { ProfileData } from '@/shared/data/core/profile-data/profile-data';

export function SupplierHero() {
  return (
    <div
      className={'relative w-full overflow-hidden'}
      style={{ height: '442px' }}
    >
      <Image
        src={ROUTES.S3('supplier/hero-bg.png')}
        alt={'banner'}
        className={'w-full h-full object-cover'}
        unoptimized
        fill
      />

      <div
        className={
          'absolute bottom-6 left-10 bg-white rounded-2xl p-4 flex items-center gap-3 shadow-lg'
        }
        style={{ width: '457px', height: '136px' }}
      >
        <div
          className={
            'rounded-xl bg-neutral-800 flex items-center justify-center shrink-0'
          }
          style={{ width: '120px', height: '120px' }}
        >
          <span className={'text-white text-sm font-bold'}>NOBLE</span>
        </div>

        <div className={'flex flex-col flex-1 justify-between h-full py-1'}>
          <div className={'flex flex-1 flex-col justify-center'}>
            <p className={'text-xl font-bold'}>{ProfileData.companyName}</p>
            <p
              className={
                'text-[14px] uppercase tracking-widest text-muted-foreground'
              }
            >
              {ProfileData.location}
            </p>
          </div>
          <div className={'flex justify-end'}>
            <div className={'flex items-center gap-0.5'}>
              {[...Array(4)].map((_, i) => (
                <Star
                  key={i}
                  className={'w-3 h-3 fill-yellow-400 text-yellow-400'}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div
        className={
          'absolute right-10 bg-white rounded-2xl p-5 flex flex-col justify-center gap-3 shadow-lg'
        }
        style={{ width: '413px', height: '280px', top: '84px' }}
      >
        <p className={'text-sm text-muted-foreground leading-relaxed'}>
          {ProfileData.description}
        </p>

        <div className={'flex flex-wrap gap-1.5'}>
          {ProfileData.curatorsType.map(tag => (
            <span
              key={tag.label}
              className={
                'text-[12px] font-semibold px-2.5 py-1 rounded-full bg-secondary/10 text-secondary'
              }
            >
              {tag.label}
            </span>
          ))}
        </div>

        <div className={'flex items-center gap-2'}>
          <span
            className={
              'text-[12px] uppercase tracking-widest text-muted-foreground'
            }
          >
            Lead Time
          </span>
          <span className={'text-sm font-semibold'}>
            {ProfileData.leadTime}
          </span>
        </div>
        <button
          className={
            'text-[12px] font-bold uppercase tracking-widest text-secondary underline underline-offset-2 text-left'
          }
        >
          Company's Terms of Use
        </button>

        <div className={'flex flex-col gap-1.5'}>
          <div className={'flex items-center gap-2'}>
            <MapPin className={'w-3.5 h-3.5 text-muted-foreground shrink-0'} />
            <span className={'text-sm text-muted-foreground'}>
              {ProfileData.address}
            </span>
          </div>
          <div className={'flex items-center gap-2'}>
            <Mail className={'w-3.5 h-3.5 text-muted-foreground shrink-0'} />
            <span className={'text-sm text-muted-foreground'}>
              {ProfileData.email}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
