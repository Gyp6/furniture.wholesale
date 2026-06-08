import { Header, Footer } from '@/components/layout';
import { ActiveBundleBar } from '@/components/sections/core/catalog';
import { UnsavedChangesModal } from '@/components/ui/unsaved-changes-modal';

export default function CoreLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <div className={'flex flex-col min-h-screen'}>
      <Header />
      <div className={'flex-1'}>
        {children}
        {modal}
      </div>
      <ActiveBundleBar />
      <UnsavedChangesModal />
      <Footer />
    </div>
  );
}
