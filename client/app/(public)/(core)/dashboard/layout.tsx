import { HeroBg } from '@/components/layout';
import { ROUTES } from '@/constants';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={'flex flex-col min-h-screen bg-white'}>
      <HeroBg
        title={'Dashboard'}
        image={ROUTES.S3('marketplace/hero-bg.png')}
      />
      <main className={'relative -top-18 px-10'}>
        <section
          className={
            'rounded-t-4xl bg-white p-10 flex flex-col items-center gap-10 w-full overflow-hidden'
          }
        >
          {children}
        </section>
      </main>
    </div>
  );
}
