'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, Upload } from 'lucide-react';

import { ICONS } from '@/shared/data/icons';
import { companyService } from '@/services';
import { CompanyProfileEditState } from '@/components/pages/core/profile/profile';
import { ROUTES } from '@/constants';

interface BrandIdentityProps {
  formData: CompanyProfileEditState;
  onChange: (updates: Partial<CompanyProfileEditState>) => void;
  companyTaxCode?: string;
}

export function BrandIdentity({ formData, onChange, companyTaxCode }: BrandIdentityProps) {
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const [bannerUploading, setBannerUploading] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [bannerUploaded, setBannerUploaded] = useState(false);
  const [logoUploaded, setLogoUploaded] = useState(false);

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'image/png') {
      toast.error('Only PNG files are allowed for banner.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB.');
      return;
    }

    try {
      setBannerUploading(true);
      setBannerUploaded(false);
      const { uploadUrl } = await companyService.getBannerUploadUrl();
      await companyService.uploadFileToS3(uploadUrl, file, 'image/png');
      setBannerPreview(URL.createObjectURL(file));
      setBannerUploaded(true);
      toast.success('Banner uploaded successfully!');
    } catch {
      toast.error('Failed to upload banner.');
    } finally {
      setBannerUploading(false);
    }
  };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'image/png') {
      toast.error('Only PNG files are allowed for logo.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB.');
      return;
    }

    try {
      setLogoUploading(true);
      setLogoUploaded(false);
      const { uploadUrl } = await companyService.getLogoUploadUrl();
      await companyService.uploadFileToS3(uploadUrl, file, 'image/png');
      setLogoPreview(URL.createObjectURL(file));
      setLogoUploaded(true);
      toast.success('Logo uploaded successfully!');
    } catch {
      toast.error('Failed to upload logo.');
    } finally {
      setLogoUploading(false);
    }
  };

  const existingBanner = companyTaxCode
    ? ROUTES.S3(`identity/company/${companyTaxCode}/company-cover.png`)
    : null;
  const existingLogo = companyTaxCode
    ? ROUTES.S3(`identity/company/${companyTaxCode}/logo.png`)
    : null;

  return (
    <div className={'flex flex-col gap-4'}>
      <div className={'flex items-center gap-2'}>
        <div
          className={
            'w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-md'
          }
        >
          <span className={'text-sm font-bold text-secondary'}>01</span>
        </div>
        <h2 className={'text-2xl font-bold'}>
          Brand Identity & Contact Information
        </h2>
      </div>

      <div className={'grid grid-cols-2 gap-4'}>
        <div className={'bg-white rounded-[30px] p-6 flex flex-col gap-4'}>
          <div className={'flex flex-col gap-2'}>
            <span
              className={
                'text-[14px] font-bold uppercase tracking-widest text-muted-foreground'
              }
            >
              Banner
            </span>
            <input
              ref={bannerInputRef}
              type={"file"}
              accept={"image/png"}
              className={"hidden"}
              onChange={handleBannerUpload}
            />
            <div
              className={
                'rounded-2xl border-2 border-dashed border-neutral-200 bg-secondary/5 flex flex-col items-center justify-center gap-2 h-[120px] cursor-pointer hover:bg-secondary/10 transition-colors overflow-hidden relative'
              }
              onClick={() => bannerInputRef.current?.click()}
            >
              {bannerUploading ? (
                <Loader2 className={"w-6 h-6 text-secondary animate-spin"} />
              ) : bannerPreview || existingBanner ? (
                <>
                  <img
                    src={bannerPreview || existingBanner!}
                    alt={"Banner preview"}
                    className={"w-full h-full object-cover absolute inset-0"}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className={"absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"}>
                    <Upload className={"w-6 h-6 text-white"} />
                  </div>
                  {bannerUploaded && (
                    <div className={"absolute top-2 right-2 z-10"}>
                      <CheckCircle2 className={"w-5 h-5 text-green-500"} />
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div
                    className={
                      'w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center'
                    }
                  >
                    <Upload className={"w-4 h-4 text-secondary"} />
                  </div>
                  <p className={'text-[12px] text-muted-foreground text-center'}>
                    PNG only
                    <br />
                    Max 5MB.
                  </p>
                </>
              )}
            </div>
          </div>

          <div className={'flex gap-6'}>
            <div className={'flex flex-col gap-2 shrink-0'}>
              <span
                className={
                  'text-[14px] font-bold uppercase tracking-widest text-muted-foreground'
                }
              >
                Logo
              </span>
              <input
                ref={logoInputRef}
                type={"file"}
                accept={"image/png"}
                className={"hidden"}
                onChange={handleLogoUpload}
              />
              <div
                className={
                  'rounded-2xl border-2 border-dashed border-neutral-200 bg-secondary/5 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-secondary/10 transition-colors overflow-hidden relative'
                }
                style={{ width: '160px', height: '160px' }}
                onClick={() => logoInputRef.current?.click()}
              >
                {logoUploading ? (
                  <Loader2 className={"w-6 h-6 text-secondary animate-spin"} />
                ) : logoPreview || existingLogo ? (
                  <>
                    <img
                      src={logoPreview || existingLogo!}
                      alt={"Logo preview"}
                      className={"w-full h-full object-cover absolute inset-0"}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                    <div className={"absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"}>
                      <Upload className={"w-6 h-6 text-white"} />
                    </div>
                    {logoUploaded && (
                      <div className={"absolute top-2 right-2 z-10"}>
                        <CheckCircle2 className={"w-5 h-5 text-green-500"} />
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div
                      className={
                        'w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center'
                      }
                    >
                      <Upload className={"w-4 h-4 text-secondary"} />
                    </div>
                    <p className={'text-[12px] text-muted-foreground text-center'}>
                      PNG only
                      <br />
                      Max 5MB.
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className={'flex flex-col gap-2 flex-1'}>
              <span
                className={
                  'text-[14px] font-bold uppercase tracking-widest text-muted-foreground'
                }
              >
                Company Narrative
              </span>
              <div className={'relative flex-1'}>
                <textarea
                  placeholder={
                    'Describe your heritage, craftsmanship, and values...'
                  }
                  maxLength={1500}
                  value={formData.description}
                  onChange={e => onChange({ description: e.target.value })}
                  className={
                    'w-full h-[120px] rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm resize-none outline-none focus:border-secondary transition-colors placeholder:text-muted-foreground'
                  }
                />
                <span
                  className={
                    'absolute bottom-2 right-3 text-[12px] text-muted-foreground'
                  }
                >
                  {formData.description.length}/1500 Characters
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={'flex flex-col gap-4'}>
          <div className={'bg-white rounded-[30px] p-6 flex flex-col gap-4'}>
            <div className={'flex flex-col gap-2'}>
              <span
                className={
                  'text-[14px] font-bold uppercase tracking-widest text-muted-foreground'
                }
              >
                Company Name
              </span>
              <input
                type={'text'}
                value={formData.name}
                onChange={e => onChange({ name: e.target.value })}
                className={
                  'rounded-full border border-neutral-200 bg-neutral-50 px-5 py-3 text-sm outline-none focus:border-secondary transition-colors'
                }
              />
            </div>
            <div className={'flex flex-col gap-2'}>
              <span
                className={
                  'text-[14px] font-bold uppercase tracking-widest text-muted-foreground'
                }
              >
                Public Business Email
              </span>
              <input
                type={'email'}
                value={formData.businessEmail}
                onChange={e => onChange({ businessEmail: e.target.value })}
                className={
                  'rounded-full border border-neutral-200 bg-neutral-50 px-5 py-3 text-sm outline-none focus:border-secondary transition-colors'
                }
              />
            </div>
            <div className={'flex flex-col gap-2'}>
              <span
                className={
                  'text-[14px] font-bold uppercase tracking-widest text-muted-foreground'
                }
              >
                Showroom Address
              </span>
              <input
                type={'text'}
                placeholder={'Street, City, Country'}
                value={formData.showroomAddress}
                onChange={e => onChange({ showroomAddress: e.target.value })}
                className={
                  'rounded-full border border-neutral-200 bg-neutral-50 px-5 py-3 text-sm outline-none focus:border-secondary transition-colors'
                }
              />
            </div>
          </div>

          <div className={'bg-white rounded-[30px] p-6 flex flex-col gap-2'}>
            <div className={'flex items-center gap-2'}>
              <ICONS.Tips
                size={20}
                color={'currentColor'}
                className={'text-secondary'}
              />
              <p className={'text-lg font-semibold'}>Curator's Tip</p>
            </div>
            <p className={'text-sm text-muted-foreground leading-relaxed'}>
              High-quality photography increases engagement by 40%. Ensure your
              narrative mentions specific materials used in your production.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
