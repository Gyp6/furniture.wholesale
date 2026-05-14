'use client';

import { ProjectHeader } from '@/components/sections/core/cart/header-bg';
import { OrderGrid } from '@/components/sections/core/cart/items-grid';
import { PrebuiltBundleSection } from '@/components/sections/core/cart/bundles-grid';
import { OrderSummary } from '@/components/sections/core/cart/order-checkout';

export function CartPage() {
  return (
    <div className="min-h-screen w-full bg-secondary/10">
      <div className="w-full mx-auto px-7 py-10 flex flex-col gap-5">

        <ProjectHeader />

        <div className="flex flex-col gap-3">
          <OrderGrid />
        </div>

        <div className="flex flex-col gap-3">
          <PrebuiltBundleSection />
        </div>

        <OrderSummary />

      </div>
    </div>
  );
}