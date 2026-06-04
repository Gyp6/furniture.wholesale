'use client';

import { ProfileData } from '@/shared/data/core/profile-data/profile-data';
import { ICONS } from '@/shared/data/icons';

export function BrandIdentity() {
  return (
    <div className="flex flex-col gap-4">

      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-md">
          <span className="text-sm font-bold text-secondary">01</span>
        </div>
        <h2 className="text-2xl font-bold">Brand Identity & Contact Information</h2>
      </div>

      <div className="grid grid-cols-2 gap-4">

        <div className="bg-white rounded-[30px] p-6 flex flex-col gap-4">

          <div className="flex flex-col gap-2">
            <span className="text-[14px] font-bold uppercase tracking-widest text-muted-foreground">Banner</span>
            <div className="rounded-2xl border-2 border-dashed border-neutral-200 bg-secondary/5 flex flex-col items-center justify-center gap-2 h-[120px] cursor-pointer hover:bg-secondary/10 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                <span className="text-secondary text-lg">↑</span>
              </div>
              <p className="text-[12px] text-muted-foreground text-center">
                PNG, or JPG<br />Max 5MB.
              </p>
            </div>
          </div>

          <div className="flex gap-6">
            <div className="flex flex-col gap-2 shrink-0">
              <span className="text-[14px] font-bold uppercase tracking-widest text-muted-foreground">Logo</span>
              <div
                className="rounded-2xl border-2 border-dashed border-neutral-200 bg-secondary/5 flex flex-col items-center justify-center gap-2 h-[120px] cursor-pointer hover:bg-secondary/10 transition-colors"
                style={{ width: '160px', height:'160px' }}
              >
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <span className="text-secondary text-lg">↑</span>
                </div>
                <p className="text-[12px] text-muted-foreground text-center">
                  PNG, or JPG<br />Max 5MB.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <span className="text-[14px] font-bold uppercase tracking-widest text-muted-foreground">Company Narrative</span>
              <div className="relative flex-1">
                <textarea
                  placeholder="Describe your heritage, craftsmanship, and values..."
                  maxLength={1500}
                  className="w-full h-[120px] rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm resize-none outline-none focus:border-secondary transition-colors placeholder:text-muted-foreground"
                />
                <span className="absolute bottom-2 right-3 text-[12px] text-muted-foreground">0/1500 Characters</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">

          <div className="bg-white rounded-[30px] p-6 flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <span className="text-[14px] font-bold uppercase tracking-widest text-muted-foreground">Public Business Email</span>
              <input
                type="email"
                defaultValue={ProfileData.email}
                className="rounded-full border border-neutral-200 bg-neutral-50 px-5 py-3 text-sm outline-none focus:border-secondary transition-colors"
              />
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[14px] font-bold uppercase tracking-widest text-muted-foreground">Showroom Address</span>
              <input
                type="text"
                placeholder="Street, City, Country"
                className="rounded-full border border-neutral-200 bg-neutral-50 px-5 py-3 text-sm outline-none focus:border-secondary transition-colors"
              />
            </div>
          </div>

          <div className="bg-white rounded-[30px] p-6 flex flex-col gap-2">
  <div className="flex items-center gap-2">
    <ICONS.Tips size={20} color="currentColor" className="text-secondary" />
    <p className="text-lg font-semibold">Curator's Tip</p>
  </div>
  <p className="text-sm text-muted-foreground leading-relaxed">
    High-quality photography increases engagement by 40%. Ensure your narrative mentions specific materials used in your production.
  </p>
</div>

        </div>
      </div>
    </div>
  );
}