'use client';

import { ArrowUpRight } from 'lucide-react';

import { Button } from '@/components/ui/shadcn/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
} from '@/components/ui/shadcn/carousel';
import { ORDER_STATUS_STYLES } from '@/constants/dashboard.const';
import { authClient } from '@/lib';
import {
  CurationToolsData,
  DesignerStatsData,
  OrdersData,
  ProjectsData,
} from '@/shared/data/dashboard';
import { ICONS } from '@/shared/data/icons';
import { EOrderStatus } from '@/shared/enums/dashboard.enum';

const ICON_MAP: Record<string, React.ReactNode> = {
  Cart: (
    <ICONS.Cart
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
  Market: (
    <ICONS.Market
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

export function DesignerDashboardPage() {
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
            Designer Overview
          </p>
          <h1 className={'text-2xl font-bold tracking-tight'}>
            Welcome back, {name}!
          </h1>
        </div>
        <Button
          className={'rounded-full gap-2'}
          variant={'default'}
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
          'container mx-auto px-6 py-4 flex flex-col lg:flex-row gap-10 flex-1 min-h-0'
        }
      >
        <div className={'flex-1 min-w-0 flex flex-col min-h-0'}>
          <h2 className={'text-lg font-semibold mb-3'}>Orders</h2>

          <div
            className={
              'rounded-2xl border border-neutral-100 overflow-hidden flex flex-col min-h-0 flex-1 max-w-[920px] bg-white'
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
                    'grid grid-cols-[0.8fr_0.8fr_1fr_1fr_0.8fr_1fr] items-center px-5 py-3 border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors'
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

                  <Button
                    variant={'secondary'}
                    size={'sm'}
                    className={
                      'rounded-xl gap-1 text-[10px] w-full h-7 px-3 bg-secondary/15 text-secondary hover:bg-secondary/25'
                    }
                  >
                    <ICONS.RefreshLoading
                      size={10}
                      color={'currentColor'}
                    />
                    Order again
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={'w-full lg:w-[520px] shrink-0 flex flex-col gap-6'}>
          <div>
            <h2 className={'text-lg font-semibold mb-3'}>Statistics</h2>
            <div className={'grid grid-cols-2 gap-3'}>
              {DesignerStatsData.map(stat => (
                <div
                  key={stat.label}
                  className={
                    'relative rounded-2xl border border-neutral-100 p-6 bg-white min-h-[140px]'
                  }
                >
                  <span
                    className={`absolute top-3 right-3 text-[9px] font-semibold px-2 py-0.5 rounded-full ${stat.badgeColor}`}
                  >
                    {stat.badge}
                  </span>
                  <div
                    className={
                      'w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center mb-4'
                    }
                  >
                    {ICON_MAP[stat.icon]}
                  </div>
                  <p className={'text-4xl font-bold tracking-tight'}>
                    {stat.value}
                  </p>
                  <p
                    className={
                      'text-[10px] uppercase tracking-widest text-muted-foreground mt-2'
                    }
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className={'text-lg font-semibold mb-3'}>Active Projects</h2>
            <Carousel
              opts={{ align: 'start', dragFree: true }}
              className={'w-full'}
            >
              <CarouselContent className={'-ml-2'}>
                {ProjectsData.map((project, i) => (
                  <CarouselItem
                    key={i}
                    className={'pl-2 basis-[130px]'}
                  >
                    <div
                      className={
                        'rounded-2xl border border-neutral-100 p-4 bg-white flex flex-col justify-between min-h-[120px]'
                      }
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
                        <p className={'text-sm font-semibold leading-tight'}>
                          {project.title}
                        </p>
                        <p className={'text-xs text-muted-foreground mt-1'}>
                          {project.units} Units
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
          </div>

          <div>
            <h2 className={'text-lg font-semibold mb-3'}>Curation Tools</h2>
            <div className={'grid grid-cols-2 gap-2'}>
              {CurationToolsData.map(tool => (
                <div
                  key={tool.title}
                  className={
                    'rounded-2xl border border-neutral-100 p-3 bg-white flex items-center gap-2 cursor-pointer hover:bg-secondary/5 transition-colors min-h-[60px]'
                  }
                >
                  <div
                    className={
                      'w-7 h-7 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0'
                    }
                  >
                    {ICON_MAP[tool.icon]}
                  </div>
                  <div>
                    <p className={'text-xs font-semibold'}>{tool.title}</p>
                    <p className={'text-[10px] text-muted-foreground'}>
                      {tool.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
