'use client';

import { useState } from 'react';

import { Footer } from '@/components/layout/footer';
import {
  BundleCreateForm,
  BundleCreateHeader,
  BundleCreateItems,
} from '@/components/sections/core/bundle-create';

export function BundleCreatePage() {
  const [itemsCount, setItemsCount] = useState(0);

  return (
    <div
      className={
        'min-h-screen bg-secondary/10 px-10 py-10 pt-[100px] flex flex-col gap-6'
      }
    >
      <BundleCreateHeader itemsCount={itemsCount} />
      <BundleCreateForm />
      <BundleCreateItems onItemsCountChange={setItemsCount} />
      <Footer />
    </div>
  );
}
