import { HeroBg } from '@/components/layout';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={'flex flex-col min-h-screen bg-secondary/10'}>
      <HeroBg title={'Dashboard'} />
      <main className={'relative -top-18 px-10'}>
        <section className={'rounded-t-4xl bg-secondary/10 p-10 w-full'}>
          {children}
        </section>
      </main>
    </div>
  );
}
