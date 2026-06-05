import { SupplierHero, SupplierBundles } from '@/components/sections/core/supplier';

import { Footer } from '@/components/layout/footer';

export function SupplierPage() {
  return (
    <div className="flex flex-col">
      <SupplierHero />
      <SupplierBundles />
      <Footer />
    </div>
  );
}