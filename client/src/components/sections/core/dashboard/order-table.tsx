import { Button } from '@/components/ui/shadcn/button';
import { ORDER_STATUS_STYLES } from '@/constants';
import { OrdersData } from '@/shared/data/dashboard';
import { ICONS } from '@/shared/data/icons';
import { EOrderStatus } from '@/shared/enums/dashboard.enum';

export function OrderTable() {
  return (
    <div
      className={
        'rounded-4xl border border-neutral-100 overflow-hidden flex flex-1 flex-col bg-white w-full'
      }
    >
      <div
        className={
          'grid grid-cols-[0.8fr_0.8fr_1fr_1fr_0.8fr_1fr] px-5 py-3 border-b border-neutral-100 shrink-0'
        }
      >
        {['ORDER ID', 'ITEMS', 'DATE', 'STATUS', 'TOTAL', ''].map(col => (
          <span
            key={col}
            className={
              'text-[14px] font-bold uppercase tracking-widest text-muted-foreground'
            }
          >
            {col}
          </span>
        ))}
      </div>

      <div className={'overflow-y-auto scrollbar-hide flex-1'}>
        {OrdersData.map((order, i) => (
          <div
            key={i}
            className={
              'grid grid-cols-[0.8fr_0.8fr_1fr_1fr_0.8fr_1fr] items-center px-5 py-3 border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors'
            }
          >
            <span className={'text-14 font-medium'}>{order.id}</span>

            <div className={'flex items-center gap-1'}>
              <div className={'flex -space-x-2'}>
                <div
                  className={
                    'w-6 h-6 rounded-full bg-neutral-300 border-2 border-white'
                  }
                />
                <div
                  className={
                    'w-6 h-6 rounded-full bg-neutral-400 border-2 border-white'
                  }
                />
              </div>
              {order.items > 0 && (
                <span className={'text-[14px] text-muted-foreground ml-0.5'}>
                  +{order.items}
                </span>
              )}
            </div>

            <span className={'text-14 text-muted-foreground'}>
              {order.date}
            </span>

            <span
              className={`inline-flex w-fit px-2.5 py-0.5 rounded-full text-[14px] font-bold uppercase tracking-wide ${ORDER_STATUS_STYLES[order.status as EOrderStatus]}`}
            >
              {order.status}
            </span>

            <span className={'text-14 font-semibold'}>
              $
              {order.total.toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}
            </span>

            <Button
              variant={'secondary'}
              size={'sm'}
              className={
                'rounded-2xl gap-1 text-[14px] w-full h-10 px-3 bg-secondary/15 text-secondary hover:bg-secondary/25'
              }
            >
              <ICONS.RefreshLoading
                size={20}
                color={'currentColor'}
              />
              Order again
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
