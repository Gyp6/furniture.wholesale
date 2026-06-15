'use client';

import dynamic from 'next/dynamic';
import { Header, Footer } from '@/components/layout';
import { UnsavedChangesModal } from '@/components/ui/unsaved-changes-modal';

// Замість звичайного import ActiveBundleBar from '...'
const ActiveBundleBar = dynamic(
  () => import('@/components/sections/core/catalog/active-bundle-bar').then(mod => mod.ActiveBundleBar),
  { ssr: false }
);

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
