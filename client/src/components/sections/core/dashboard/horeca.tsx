'use client';

import { ArrowUpRight } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/shadcn/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from '@/components/ui/shadcn/carousel';
import { Skeleton } from '@/components/ui/shadcn/skeleton';
import { ORDER_STATUS_STYLES } from '@/constants/dashboard.const';
import { useRouter } from 'next/navigation';

import { useGetMyBundles, useGetMyOrders } from '@/hooks/queries';
import { authClient } from '@/lib';
import { CurationToolsData, HoRecaStatsData } from '@/shared/data/dashboard';
import { ICONS } from '@/shared/data/icons';
import { EOrderStatus } from '@/shared/enums/dashboard.enum';
import { useSpaceBundleStore } from '@/store/use-space-bundle.store';
import { useUnsavedChangesStore } from '@/store/use-unsaved-changes.store';

import { OrderDetailsModal } from './order-details-modal';

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
  WalletFigma: (
    <ICONS.WalletFigma
      size={20}
      color={'currentColor'}
      className={'text-muted-foreground'}
    />
  ),
  Bundles: (
    <ICONS.Bundles
      size={20}
      color={'currentColor'}
      className={'text-muted-foreground'}
    />
  ),
  Stonks: (
    <ICONS.Stonks
      size={20}
      color={'currentColor'}
      className={'text-muted-foreground'}
    />
  ),
};

export function HoRecaDashboardPage() {
  const router = useRouter();
  const setActiveBundle = useSpaceBundleStore(state => state.setActiveBundle);
  const clearBundle = useSpaceBundleStore(state => state.clearBundle);
  const items = useSpaceBundleStore(state => state.items);
  const activeBundleId = useSpaceBundleStore(state => state.activeBundleId);
  const showUnsavedChanges = useUnsavedChangesStore(state => state.show);

  const { data: session } = authClient.useSession();
  const name = session?.user?.name?.split(' ')[0] ?? 'there';
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const { data: orders, isLoading: ordersLoading } = useGetMyOrders();
  const { data: bundles, isLoading: bundlesLoading } = useGetMyBundles('USER');

  // Derive live stats from real data
  const liveStats = [
    {
      label: 'Total Orders',
      value: orders?.length ?? '—',
      icon: 'Cart',
      badge: '+5%',
      badgeColor: 'bg-green-100 text-green-700',
    },
    {
      label: 'Active Bundles',
      value: bundles?.length ?? '—',
      icon: 'Bundles',
      badge: 'New',
      badgeColor: 'bg-blue-100 text-blue-700',
    },
    {
      label: 'Total Spend',
      value: orders
        ? `$${orders.reduce((s, o) => s + (o.totalAmount ?? 0), 0).toLocaleString()}`
        : '—',
      icon: 'WalletFigma',
      badge: 'YTD',
      badgeColor: 'bg-purple-100 text-purple-700',
    },
  ];

  const statsToShow = liveStats.length > 0 ? liveStats : HoRecaStatsData;

  return (
    <div className={'h-[calc(100dvh-64px)] overflow-hidden flex flex-col'}>
      <div
        className={
          'w-full bg-transparent px-10 py-5 flex items-center justify-between shrink-0'
        }
      >
        <div>
          <p
            className={
              'text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1'
            }
          >
            HoReCa Overview
          </p>
          <h1 className={'text-3xl font-bold tracking-tight'}>
            Welcome back, {name}!
          </h1>
        </div>
        <Button
          className={'rounded-full gap-2'}
          variant={'default'}
          onClick={() => {
            if (items.length > 0 && activeBundleId === null) {
              showUnsavedChanges('/', () => {
                clearBundle();
                router.push('/');
              });
            } else {
              clearBundle();
              router.push('/');
            }
          }}
        >
          <ICONS.Bundle
            size={16}
            color={'currentColor'}
          />
          Create Bundle
        </Button>
      </div>

      <div
        className={
          'w-full px-10 py-4 flex flex-col lg:flex-row gap-[30px] flex-1 min-h-0 items-stretch'
        }
      >
        <div className={'flex flex-col min-h-0 flex-1'}>
          <h2 className={'text-2xl font-semibold mb-3'}>Orders</h2>

          <div
            className={
              'rounded-2xl border border-neutral-100 overflow-hidden flex flex-col min-h-0 flex-1 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.08)]'
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
              {ordersLoading ? (
                <div className={'flex flex-col gap-2 p-4'}>
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className={'h-12 rounded-xl'} />
                  ))}
                </div>
              ) : orders && orders.length > 0 ? (
                orders.map((order, i) => (
                <div
                  key={order.id || i}
                  className={
                    'grid grid-cols-[0.8fr_0.8fr_1fr_1fr_0.8fr_1fr] items-center px-5 py-3 border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors cursor-pointer'
                  }
                  onClick={() => { setSelectedOrderId(order.id); setModalOpen(true); }}
                >
                  <span className={'text-sm font-medium text-muted-foreground'}>
                    #{order.id.slice(0, 8).toUpperCase()}
                  </span>

                  <div className={'flex items-center gap-1'}>
                    <div className={'flex -space-x-2'}>
                      <div
                        className={
                          'w-6 h-6 rounded-full bg-neutral-300 border-2 border-white'
                        }
                      />
                    </div>
                    <span className={'text-[14px] text-muted-foreground ml-0.5'}>
                      {order.subOrders?.reduce((s, so) => s + so.items.length, 0) ?? 0} items
                    </span>
                  </div>

                  <span className={'text-sm text-muted-foreground'}>
                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>

                  <span
                    className={`inline-flex w-fit px-2.5 py-0.5 rounded-full text-[14px] font-bold uppercase tracking-wide ${ORDER_STATUS_STYLES[order.status as EOrderStatus] ?? 'bg-neutral-100 text-neutral-700'}`}
                  >
                    {order.status}
                  </span>

                  <span className={'text-sm font-semibold'}>
                    ${(order.totalAmount ?? 0).toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                    })}
                  </span>

                  <Button
                    variant={'secondary'}
                    size={'sm'}
                    className={
                      'rounded-2xl gap-1 text-[14px] w-full h-10 px-3 bg-secondary/15 text-secondary hover:bg-secondary/25'
                    }
                    onClick={e => {
                      e.stopPropagation();
                      setSelectedOrderId(order.id);
                      setModalOpen(true);
                    }}
                  >
                    <ICONS.RefreshLoading
                      size={20}
                      color={'currentColor'}
                    />
                    Order again
                  </Button>
                </div>
                ))
              ) : (
                <div className={'flex items-center justify-center h-full py-12 text-muted-foreground text-sm'}>
                  No orders yet. Start shopping!
                </div>
              )}
            </div>
          </div>
        </div>

        <div className={'lg:w-[600px] w-full shrink-0 flex flex-col gap-4 min-h-0'}>
          <div>
            <h2 className={'text-2xl font-semibold mb-3'}>Statistics</h2>
            <div className={'grid grid-cols-3 gap-3'}>
              {statsToShow.map(stat => (
                <div
                  key={stat.label}
                  className={
                    'relative rounded-2xl border border-neutral-100 p-5 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.08)] min-h-[130px]'
                  }
                >
                  <span
                    className={`absolute top-3 right-3 text-[12px] font-semibold px-2 py-1 rounded-full ${stat.badgeColor}`}
                  >
                    {stat.badge}
                  </span>
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
                      'text-[12px] uppercase tracking-widest text-muted-foreground mt-1'
                    }
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className={'text-2xl font-semibold mb-3'}>Active Bundles</h2>
            {bundlesLoading ? (
              <div className={'flex gap-2'}>
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className={'w-[150px] h-[160px] rounded-2xl shrink-0'} />
                ))}
              </div>
            ) : bundles && bundles.length > 0 ? (
              <Carousel
                opts={{ align: 'start', dragFree: true }}
                className={'w-full'}
              >
                <CarouselContent className={'-ml-3'}>
                  {bundles.map((bundle, i) => (
                    <CarouselItem
                      key={bundle.id || i}
                      className={'pl-2 basis-[150px]'}
                    >
                      <div
                        className={
                          'rounded-2xl border border-neutral-100 p-4 bg-white flex flex-col justify-between min-h-[160px] shadow-[0_8px_40px_rgba(0,0,0,0.08)] cursor-pointer hover:bg-secondary/5 transition-colors'
                        }
                        onClick={() => {
                          setActiveBundle(bundle);
                          router.push('/cart');
                        }}
                      >
                        <div className={'flex justify-end'}>
                          <div
                            className={
                              'w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center'
                            }
                          >
                            <ArrowUpRight className={'w-4 h-4 text-secondary'} />
                          </div>
                        </div>
                        <div>
                          <p className={'text-sm font-semibold leading-tight line-clamp-2'}>
                            {bundle.name}
                          </p>
                          <p className={'text-xs text-muted-foreground mt-1'}>
                            {bundle.items.length} Items
                          </p>
                          <p className={'text-xs font-bold text-secondary mt-1'}>
                            ${bundle.totalPrice.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselNext
                  className={
                    'right-0 top-1/2 w-10 h-10 bg-secondary/10 border-none hover:bg-secondary/20 text-secondary'
                  }
                />
              </Carousel>
            ) : (
              <p className={'text-sm text-muted-foreground'}>No active bundles yet.</p>
            )}
          </div>

          <div>
            <h2 className={'text-2xl font-semibold mb-3'}>Curation Tools</h2>
            <div className={'grid grid-cols-2 gap-4'}>
              {CurationToolsData.map(tool => (
                <div
                  key={tool.title}
                  className={
                    'rounded-2xl border border-neutral-100 p-3 bg-white flex items-center gap-2 cursor-pointer hover:bg-secondary/5 transition-colors min-h-[84px] shadow-[0_8px_40px_rgba(0,0,0,0.08)]'
                  }
                >
                  <div
                    className={
                      'w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0'
                    }
                  >
                    {ICON_MAP[tool.icon]}
                  </div>
                  <div>
                    <p className={'text-sm font-semibold'}>{tool.title}</p>
                    <p className={'text-[11px] text-muted-foreground'}>
                      {tool.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <OrderDetailsModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        orderId={selectedOrderId}
      />
    </div>
  );
}
