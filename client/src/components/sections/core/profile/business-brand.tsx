'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { ChevronDown, Plus, X, Loader2, CheckCircle2, Upload, FileText } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/shadcn/dropdown-menu';
import { LeadTimeOptions } from '@/shared/data/core/profile-data/profile-data';
import { CompanyProfileEditState } from '@/components/pages/core/profile/profile';
import { companyService } from '@/services';

interface BusinessTermsProps {
  formData: CompanyProfileEditState;
  onChange: (updates: Partial<CompanyProfileEditState>) => void;
}

const AVAILABLE_SEGMENTS = [
  'Restaurant',
  'Coworking',
  'Hotel Room',
  'Retail',
  'Office',
  'Residential',
];

export function BusinessTerms({ formData, onChange }: BusinessTermsProps) {
  const termsInputRef = useRef<HTMLInputElement>(null);
  const [termsUploading, setTermsUploading] = useState(false);
  const [termsUploaded, setTermsUploaded] = useState(false);
  const [termsFileName, setTermsFileName] = useState<string | null>(null);

  const removeSegment = (segment: string) => {
    onChange({
      specializations: formData.specializations.filter(s => s !== segment),
    });
  };

  const addSegment = (segment: string) => {
    if (!formData.specializations.includes(segment)) {
      onChange({
        specializations: [...formData.specializations, segment],
      });
    }
  };

  const handleTermsUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Only PDF files are allowed for Terms of Use.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5MB.');
      return;
    }

    try {
      setTermsUploading(true);
      setTermsUploaded(false);
      const { uploadUrl } = await companyService.getTermsUploadUrl();
      await companyService.uploadFileToS3(uploadUrl, file, 'application/pdf');
      setTermsFileName(file.name);
      setTermsUploaded(true);
      toast.success('Terms of Use uploaded successfully!');
    } catch {
      toast.error('Failed to upload Terms of Use.');
    } finally {
      setTermsUploading(false);
    }
  };

  return (
    <div className={'flex flex-col gap-4'}>
      <div className={'flex items-center gap-2'}>
        <div
          className={
            'w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-md'
          }
        >
          <span className={'text-sm font-bold text-secondary'}>02</span>
        </div>
        <h2 className={'text-2xl font-bold'}>Business Terms</h2>
      </div>

      <div className={'bg-white rounded-[30px] p-6'}>
        <div className={'grid grid-cols-2 gap-6'}>
          <div className={'flex flex-col gap-2'}>
            <span
              className={
                'text-[14px] font-bold uppercase tracking-widest text-muted-foreground'
              }
            >
              Company's Terms of Use
            </span>
            <input
              ref={termsInputRef}
              type={"file"}
              accept={"application/pdf"}
              className={"hidden"}
              onChange={handleTermsUpload}
            />
            <div
              className={
                'rounded-2xl border-2 border-dashed border-neutral-200 bg-secondary/5 flex flex-col items-center justify-center gap-2 h-[120px] cursor-pointer hover:bg-secondary/10 transition-colors relative'
              }
              onClick={() => termsInputRef.current?.click()}
            >
              {termsUploading ? (
                <Loader2 className={"w-6 h-6 text-secondary animate-spin"} />
              ) : termsUploaded && termsFileName ? (
                <div className={"flex flex-col items-center gap-2"}>
                  <div className={"flex items-center gap-2"}>
                    <FileText className={"w-6 h-6 text-secondary"} />
                    <CheckCircle2 className={"w-4 h-4 text-green-500"} />
                  </div>
                  <p className={"text-[12px] text-muted-foreground text-center truncate max-w-[200px]"}>
                    {termsFileName}
                  </p>
                  <p className={"text-[11px] text-secondary font-medium"}>
                    Click to replace
                  </p>
                </div>
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
                    PDF only. Max 5MB.
                  </p>
                </>
              )}
            </div>
          </div>

          <div className={'flex flex-col gap-4'}>
            <div className={'flex flex-col gap-2'}>
              <span
                className={
                  'text-[14px] font-bold uppercase tracking-widest text-muted-foreground'
                }
              >
                Standard Lead Time
              </span>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={
                    'w-full rounded-full border border-neutral-200 bg-neutral-50 px-5 py-3 text-sm outline-none flex items-center justify-between hover:bg-neutral-100 transition-colors cursor-pointer'
                  }
                >
                  {formData.leadTime || 'Select standard lead time'}
                  <ChevronDown className={'w-4 h-4 text-muted-foreground'} />
                </DropdownMenuTrigger>
                <DropdownMenuContent className={'w-[280px]'}>
                  {LeadTimeOptions.map(option => (
                    <DropdownMenuItem
                      key={option}
                      onClick={() => onChange({ leadTime: option })}
                      className={'text-sm cursor-pointer'}
                    >
                      {option}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className={'flex flex-col gap-2'}>
              <span
                className={
                  'text-[14px] font-bold uppercase tracking-widest text-muted-foreground'
                }
              >
                Focus Segments
              </span>
              <div className={'flex items-center gap-2 flex-wrap'}>
                {formData.specializations.map(segment => (
                  <div
                    key={segment}
                    className={
                      'flex items-center gap-1.5 bg-neutral-100 rounded-full px-3 py-1.5 text-sm font-medium'
                    }
                  >
                    {segment}
                    <button onClick={() => removeSegment(segment)}>
                      <X className={'w-3 h-3 text-muted-foreground'} />
                    </button>
                  </div>
                ))}
                
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={
                      'flex items-center gap-1 bg-secondary/10 text-secondary rounded-full px-3 py-1.5 text-sm font-medium hover:bg-secondary/20 transition-colors outline-none cursor-pointer'
                    }
                  >
                    More <Plus className={'w-3 h-3'} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {AVAILABLE_SEGMENTS.filter(
                      seg => !formData.specializations.includes(seg),
                    ).map(seg => (
                      <DropdownMenuItem
                        key={seg}
                        onClick={() => addSegment(seg)}
                        className={'text-sm cursor-pointer'}
                      >
                        {seg}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
