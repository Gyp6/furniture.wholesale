import { HeroBg } from '@/components/layout';

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={'flex flex-col min-h-screen'}>
      <HeroBg title={'Dashboard'} />
      <main className={'relative -top-18 px-10 bg-white'}>
        <section className={'rounded-4xl bg-secondary/20 p-10 w-full'}>
          {children}
        </section>
      </main>
    </div>
  );
}
