import { HeroBg } from '@/components/layout';

export default function ProductLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={'flex flex-col bg-white'}>
      <HeroBg title={'Product Detail'} />
      <main className={'-mt-18 px-10 relative z-10'}>
        <section
          className={
            'rounded-t-4xl bg-white p-10 flex flex-col items-center gap-10 w-full'
          }
        >
          {children}
        </section>
      </main>
    </div>
  );
}
