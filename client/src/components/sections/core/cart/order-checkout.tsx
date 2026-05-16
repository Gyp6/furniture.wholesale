'use client';

import { Button } from '@/components/ui/shadcn/button';
import { ICONS } from '@/shared/data/icons';

function OrderSummaryHeader() {
  return <h2 className={'text-lg font-bold'}>Order Summary</h2>;
}

function OrderSummaryContent() {
  return (
    <div className={'grid grid-cols-2 gap-10'}>
      <div className={'flex flex-col gap-0'}>
        <div
          className={
            'flex items-center justify-between py-5 border-b border-neutral-100'
          }
        >
          <span className={'text-sm text-muted-foreground'}>
            Subtotal (14 items)
          </span>
          <span className={'text-sm font-semibold'}>$28,420.00</span>
        </div>
        <div
          className={
            'flex items-center justify-between py-5 border-b border-neutral-100'
          }
        >
          <span className={'text-sm text-muted-foreground'}>
            Freight Estimation
          </span>
          <span className={'text-sm font-semibold'}>$1,250.00</span>
        </div>
        <div
          className={
            'flex items-center justify-between py-5 border-b border-neutral-100'
          }
        >
          <div className={'flex items-center gap-2'}>
            <span className={'text-sm text-muted-foreground'}>
              Platform Fee
            </span>
            <div
              className={
                'w-5 h-5 rounded-full border border-secondary flex items-center justify-center cursor-pointer'
              }
            >
              <span className={'text-[10px] text-secondary font-bold'}>i</span>
            </div>
          </div>
          <span className={'text-sm font-semibold'}>$426.30</span>
        </div>
      </div>

      <div
        className={
          'bg-secondary/10 rounded-[60px] flex flex-col items-center justify-center gap-2 p-8'
        }
      >
        <span
          className={
            'text-[10px] uppercase tracking-widest text-muted-foreground font-semibold text-center'
          }
        >
          Total Payable Amount
        </span>
        <span className={'text-4xl font-bold'}>$30,096.30</span>
        <span
          className={
            'text-[10px] uppercase tracking-widest text-muted-foreground'
          }
        >
          Excluding VAT
        </span>
      </div>
    </div>
  );
}

function OrderSummaryFooter() {
  return (
    <div className={'flex items-center justify-center gap-4'}>
      <Button
        variant={'secondary'}
        className={
          'rounded-full px-8 gap-2 bg-secondary/10 text-secondary hover:bg-secondary/20 h-12 w-[220px]'
        }
      >
        <ICONS.Bundles
          size={20}
          color={'currentColor'}
        />
        Save to Projects
      </Button>
      <Button
        variant={'default'}
        className={'rounded-full px-8 gap-2 h-12 w-[280px]'}
      >
        <ICONS.Bundle
          size={20}
          color={'currentColor'}
        />
        Confirm and Place Order
      </Button>
    </div>
  );
}

export function OrderSummary() {
  return (
    <div
      className={
        'bg-white rounded-[60px] p-10 flex flex-col gap-8 shadow-[0_8px_40px_rgba(0,0,0,0.06)]'
      }
    >
      <OrderSummaryHeader />
      <OrderSummaryContent />
      <OrderSummaryFooter />
    </div>
  );
}
