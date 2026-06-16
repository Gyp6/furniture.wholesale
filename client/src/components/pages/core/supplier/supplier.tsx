import { Footer } from '@/components/layout/footer';
import {
  SupplierBundles,
  SupplierHero,
} from '@/components/sections/core/supplier';

export function SupplierPage() {
  return (
    <div className={'flex flex-col'}>
      <SupplierHero />
      <SupplierBundles />
      <Footer />
    </div>
  );
}
