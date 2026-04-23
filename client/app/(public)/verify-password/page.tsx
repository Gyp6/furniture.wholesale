import type { Metadata } from 'next';

import { VerifyForm } from '@/features/auth/VerifyForm';

export const metadata: Metadata = {
  title: 'Verify account — Gyp6.sale',
  description: 'Enter the verification code to confirm your Gyp6.sale account.',
};

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="bg-[#1A1A2E] text-white">
        <div className="mx-auto flex h-14 max-w-7xl items-center px-6">
          <span className="text-base font-semibold">Gyp6.sale</span>
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-black/5 md:grid-cols-2">
          {/* Left panel — same as login */}
          <aside className="relative flex flex-col justify-between overflow-hidden bg-[#1A1A2E] p-10 text-white md:min-h-160">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-cover bg-center opacity-55"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1400&q=80')",
              }}
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  'linear-gradient(180deg, rgba(26,26,46,0.85) 0%, rgba(26,26,46,0.65) 40%, rgba(26,26,46,0.9) 100%), radial-gradient(1200px 600px at 85% 110%, rgba(99,102,241,0.25), transparent 60%), radial-gradient(800px 400px at 10% -10%, rgba(59,130,246,0.18), transparent 60%)',
              }}
            />

            <div className="relative flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-full bg-white text-[#1A1A2E]">
                <span className="text-xs font-bold">G</span>
              </div>
              <span className="text-sm font-medium">Gyp6.sale</span>
            </div>

            <div className="relative space-y-4">
              <p className="text-xs tracking-[0.2em] text-white/60 uppercase">
                B2B Curator Ecosystem
              </p>
              <h1 className="text-4xl leading-tight font-semibold tracking-tight">
                The B2B furniture
                <br />
                marketplace for
                <br />
                professionals
              </h1>
              <p className="max-w-sm text-sm leading-relaxed text-white/70">
                Access exclusive trade pricing, streamlined procurement tools,
                and a curated selection of global architectural brands.
              </p>
            </div>

            <div className="relative flex gap-10 pt-6 text-white">
              <div>
                <div className="text-2xl font-semibold">2.4k+</div>
                <div className="mt-1 text-[10px] tracking-[0.2em] text-white/50 uppercase">Brands</div>
              </div>
              <div>
                <div className="text-2xl font-semibold">150k</div>
                <div className="mt-1 text-[10px] tracking-[0.2em] text-white/50 uppercase">Products</div>
              </div>
              <div>
                <div className="text-2xl font-semibold">Trade</div>
                <div className="mt-1 text-[10px] tracking-[0.2em] text-white/50 uppercase">Verified</div>
              </div>
            </div>
          </aside>

          <section className="flex flex-col justify-center p-8 md:p-10">
            <VerifyForm />
          </section>
        </div>
      </div>
    </div>
  );
}