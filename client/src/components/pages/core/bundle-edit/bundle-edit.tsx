'use client';

import { useState } from 'react';

import { Footer } from '@/components/layout/footer';
import {
  BundleEditForm,
  BundleEditHeader,
} from '@/components/sections/core/bundle-edit';
import { BundleEditItems } from '@/components/sections/core/bundle-edit';

export function BundleEditPage() {
  const [hasChanges, setHasChanges] = useState(false);

  return (
    <div
      className={
        'min-h-screen bg-secondary/10 px-10 py-10 pt-[100px] flex flex-col gap-6'
      }
    >
      <BundleEditHeader hasChanges={hasChanges} />
      <BundleEditForm onChanged={() => setHasChanges(true)} />
      <BundleEditItems />
      <Footer />
    </div>
  );
}
