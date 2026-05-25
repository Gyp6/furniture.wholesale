import Link from 'next/link';

import { Card } from '@/components/ui/shadcn/card';
import { ROUTES } from '@/constants';
import { LOGO } from '@/shared/data/icons';

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className={'min-h-screen flex flex-1 flex-col gap-4 p-6 md:p-10'}>
        <div className={'max-w-52'}>
          <Link
            href={ROUTES.GITHUB.ORGANIZATION}
            className={
              'group flex justify-center items-center gap-2 md:justify-start'
            }
            target={'_blank'}
          >
            <div
              className={
                'flex size-10 items-center justify-center text-primary-foreground'
              }
            >
              <LOGO.LogoGyp6 size={50} />
            </div>
            <span className={'link text-2xl font-black tracking-widest'}>
              Gyp6.sale
            </span>
          </Link>
        </div>

        <div className={'flex flex-1 items-center justify-center'}>
          <div
            className={
              'w-full max-w-6xl overflow-hidden rounded-radius bg-white shadow-2xl ring-1 ring-black/5 grid grid-cols-2'
            }
            style={{
              height: 'calc(100vh - 250px)',
            }}
          >
            <aside
              className={
                'relative flex flex-col justify-between overflow-hidden bg-primary p-10 text-white'
              }
            >
              <div
                aria-hidden
                className={
                  'pointer-events-none absolute inset-0 bg-cover bg-center opacity-55'
                }
                style={{
                  backgroundImage: `url('${ROUTES.S3('auth/background.png')}')`,
                }}
              />
              <div
                aria-hidden
                className={'pointer-events-none absolute inset-0'}
                style={{
                  background:
                    'linear-gradient(180deg, rgba(26,26,46,0.85) 0%, rgba(26,26,46,0.65) 40%, rgba(26,26,46,0.9) 100%), radial-gradient(1200px 600px at 85% 110%, rgba(99,102,241,0.25), transparent 60%), radial-gradient(800px 400px at 10% -10%, rgba(59,130,246,0.18), transparent 60%)',
                }}
              />

              <div className={'relative flex items-center gap-2'}>
                <div
                  className={
                    'flex size-8 items-center justify-center rounded-full bg-white text-primary'
                  }
                >
                  <LOGO.LogoProject size={28} />
                </div>
                <span className={'text-sm font-medium'}>
                  Furniture.wholesale
                </span>
              </div>

              <div className={'relative space-y-4'}>
                <p
                  className={'text-xs tracking-[0.2em] text-white/60 uppercase'}
                >
                  B2B Curator Ecosystem
                </p>
                <h1
                  className={
                    'text-4xl leading-tight font-semibold tracking-tight'
                  }
                >
                  The B2B furniture
                  <br />
                  marketplace for
                  <br />
                  professionals
                </h1>
                <p className={'max-w-sm text-sm leading-relaxed text-white/70'}>
                  Access exclusive trade pricing, streamlined procurement tools,
                  and a curated selection of global architectural brands.
                </p>
              </div>

              <div className={'relative flex gap-10 text-white'}>
                <div>
                  <div className={'text-2xl font-semibold'}>2.4k+</div>
                  <div
                    className={
                      'mt-1 text-[10px] tracking-[0.2em] text-white/50 uppercase'
                    }
                  >
                    Brands
                  </div>
                </div>
                <div>
                  <div className={'text-2xl font-semibold'}>150k</div>
                  <div
                    className={
                      'mt-1 text-[10px] tracking-[0.2em] text-white/50 uppercase'
                    }
                  >
                    Products
                  </div>
                </div>
                <div>
                  <div className={'text-2xl font-semibold'}>Trade</div>
                  <div
                    className={
                      'mt-1 text-[10px] tracking-[0.2em] text-white/50 uppercase'
                    }
                  >
                    Verified
                  </div>
                </div>
              </div>
            </aside>

            <Card
              className={
                'flex flex-col justify-center px-8 rounded-none gap-8 overflow-scroll'
              }
            >
              {children}
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
