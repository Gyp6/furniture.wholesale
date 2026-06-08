'use client';

import { ProjectHeader } from '@/components/sections/core/cart/header-bg';
import { OrderGrid } from '@/components/sections/core/cart/items-grid';
import { OrderSummary } from '@/components/sections/core/cart/order-checkout';

export function CartPage() {
  return (
    <div className={'min-h-screen w-full bg-secondary/10'}>
      <div
        className={'w-full mx-auto px-7 pt-[100px] pb-10 flex flex-col gap-8'}
      >
        <ProjectHeader />

        <OrderGrid />

        <OrderSummary />
      </div>
    </div>
  );
}
