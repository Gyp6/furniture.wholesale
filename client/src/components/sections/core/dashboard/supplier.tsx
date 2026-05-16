'use client';

import { ArrowUpRight, Check, X } from 'lucide-react';

import { Button } from '@/components/ui/shadcn/button';
import {
  CATEGORY_STYLES,
  INVENTORY_STATUS_STYLES,
  ORDER_STATUS_STYLES,
} from '@/constants/dashboard.const';
import { authClient } from '@/lib';
import {
  InventoryData,
  OrdersData,
  SupplierStatsData,
} from '@/shared/data/dashboard';
import { ICONS } from '@/shared/data/icons';
import { EInventoryStatus, EOrderStatus } from '@/shared/enums/dashboard.enum';

const ICON_MAP: Record<string, React.ReactNode> = {
  Cart: (
    <ICONS.Cart
      size={20}
      color={'currentColor'}
      className={'text-muted-foreground'}
    />
  ),
  Market: (
    <ICONS.Market
      size={20}
      color={'currentColor'}
      className={'text-muted-foreground'}
    />
  ),
  OrganizationFigma: (
    <ICONS.OrganizationFigma
      size={20}
      color={'currentColor'}
      className={'text-muted-foreground'}
    />
  ),
};

export function SupplierDashboardPage() {
  const { data: session } = authClient.useSession();
  const name = session?.user?.name?.split(' ')[0] ?? 'there';

  return (
    <div
      className={
        'h-[calc(100vh-64px)] overflow-hidden flex flex-col bg-secondary/10'
      }
    >
      <div
        className={
          'w-full bg-transparent px-8 py-5 flex items-center justify-between shrink-0'
        }
      >
        <div>
          <p
            className={
              'text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1'
            }
          >
            Curator Overview
          </p>
          <h1 className={'text-2xl font-bold tracking-tight'}>
            Welcome back, {name}!
          </h1>
        </div>
        <Button
          className={'rounded-full gap-2'}
          variant={'default'}
        >
          <ICONS.Bundles
            size={16}
            color={'currentColor'}
          />
          Add New Bundle
        </Button>
      </div>

      <div
        className={
          'container mx-auto px-6 py-4 flex flex-col lg:flex-row gap-6 flex-1 min-h-0'
        }
      >
        <div className={'flex-1 min-w-0 flex flex-col min-h-0'}>
          <h2 className={'text-lg font-semibold mb-3'}>Orders</h2>

          <div
            className={
              'rounded-2xl border border-neutral-100 overflow-hidden flex flex-col min-h-0 flex-1 bg-white'
            }
          >
            <div
              className={
                'grid grid-cols-[1fr_1fr_1fr_1fr_1fr_0.8fr] px-5 py-3 border-b border-neutral-100 shrink-0'
              }
            >
              {['ORDER ID', 'ITEMS', 'DATE', 'STATUS', 'TOTAL', ''].map(col => (
                <span
                  key={col}
                  className={
                    'text-[10px] font-bold uppercase tracking-widest text-muted-foreground'
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
                    'grid grid-cols-[1fr_1fr_1fr_1fr_1fr_0.8fr] items-center px-5 py-3 border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors'
                  }
                >
                  <span className={'text-xs font-medium'}>{order.id}</span>

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
                      <span
                        className={'text-[10px] text-muted-foreground ml-0.5'}
                      >
                        +{order.items}
                      </span>
                    )}
                  </div>

                  <span className={'text-xs text-muted-foreground'}>
                    {order.date}
                  </span>

                  <span
                    className={`inline-flex w-fit px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${ORDER_STATUS_STYLES[order.status as EOrderStatus]}`}
                  >
                    {order.status}
                  </span>

                  <span className={'text-xs font-semibold'}>
                    $
                    {order.total.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                    })}
                  </span>

                  {order.status === EOrderStatus.PENDING ? (
                    <div className={'flex items-center gap-1.5'}>
                      <button
                        className={
                          'w-9 h-9 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-200 transition-colors'
                        }
                      >
                        <Check className={'w-4 h-4 text-green-600'} />
                      </button>
                      <button
                        className={
                          'w-9 h-9 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors'
                        }
                      >
                        <X className={'w-4 h-4 text-red-500'} />
                      </button>
                    </div>
                  ) : (
                    <div />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div
          className={
            'w-full lg:w-[560px] shrink-0 flex flex-col gap-4 min-h-0 overflow-hidden'
          }
        >
          <div
            className={
              'rounded-2xl bg-white overflow-hidden flex flex-col h-[45%] shrink-0'
            }
          >
            <div className={'px-5 py-4 shrink-0'}>
              <h2 className={'text-base font-semibold'}>Active Inventory</h2>
            </div>

            <div
              className={
                'grid grid-cols-[2fr_1fr_0.8fr_0.8fr_0.6fr] px-5 py-2 border-y border-neutral-50 shrink-0'
              }
            >
              {[
                'PRODUCT NAME',
                'CATEGORY',
                'STOCK LEVEL',
                'STATUS',
                'ACTION',
              ].map(col => (
                <span
                  key={col}
                  className={
                    'text-[9px] font-bold uppercase tracking-widest text-muted-foreground'
                  }
                >
                  {col}
                </span>
              ))}
            </div>

            <div className={'overflow-y-auto scrollbar-hide flex-1'}>
              {InventoryData.map((item, i) => (
                <div
                  key={i}
                  className={
                    'grid grid-cols-[2fr_1fr_0.8fr_0.8fr_0.6fr] items-center px-5 py-3 border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors'
                  }
                >
                  <div className={'flex items-center gap-2'}>
                    <div
                      className={'w-7 h-7 rounded-lg bg-neutral-100 shrink-0'}
                    />
                    <span className={'text-xs font-medium leading-tight'}>
                      {item.name}
                    </span>
                  </div>

                  <span
                    className={`inline-flex w-fit px-2 py-0.5 rounded-full text-[9px] font-semibold ${CATEGORY_STYLES[item.category] ?? 'bg-neutral-100 text-neutral-600'}`}
                  >
                    {item.category}
                  </span>

                  <span className={'text-xs text-muted-foreground'}>
                    {item.stock} units
                  </span>

                  <div className={'flex items-center gap-1'}>
                    <div
                      className={`w-1.5 h-1.5 rounded-full ${item.status === EInventoryStatus.ACTIVE ? 'bg-green-500' : 'bg-neutral-300'}`}
                    />
                    <span
                      className={`text-xs ${INVENTORY_STATUS_STYLES[item.status]}`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className={'flex items-center gap-2'}>
                    <button
                      className={
                        'w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center hover:bg-secondary/20 transition-colors'
                      }
                    >
                      <ICONS.PenFigma
                        size={14}
                        color={'currentColor'}
                        className={'text-secondary'}
                      />
                    </button>
                    <button
                      className={
                        'w-8 h-8 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors'
                      }
                    >
                      <ICONS.TrashFigma
                        size={14}
                        color={'currentColor'}
                        className={'text-red-500'}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={'grid grid-cols-3 gap-3 shrink-0'}>
            {SupplierStatsData.map(stat => (
              <div
                key={stat.label}
                className={
                  'relative rounded-2xl border border-neutral-100 p-5 bg-white min-h-[130px]'
                }
              >
                {stat.badge && (
                  <span
                    className={`absolute top-2.5 right-2.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${stat.badgeColor}`}
                  >
                    {stat.badge}
                  </span>
                )}
                <div
                  className={
                    'w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center mb-3'
                  }
                >
                  {ICON_MAP[stat.icon]}
                </div>
                <p className={'text-3xl font-bold tracking-tight'}>
                  {stat.value}
                </p>
                <p
                  className={
                    'text-[9px] uppercase tracking-widest text-muted-foreground mt-1'
                  }
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div
            className={
              'rounded-2xl border border-neutral-100 bg-white p-5 flex items-center justify-between shrink-0'
            }
          >
            <div>
              <p className={'text-sm font-semibold'}>Profile Completeness</p>
              <p className={'text-xs text-muted-foreground mt-0.5'}>
                Increase visibility by finishing your setup.
              </p>
            </div>
            <button
              className={
                'w-10 h-10 rounded-full bg-foreground flex items-center justify-center shrink-0 hover:bg-foreground/80 transition-colors'
              }
            >
              <ArrowUpRight className={'w-4 h-4 text-background'} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
