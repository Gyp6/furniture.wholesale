'use client';

import { useState } from 'react';
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
  HoRecaStatsData,
  OrdersData,
  ProjectsData,
} from '@/shared/data/dashboard';
import { ICONS } from '@/shared/data/icons';
import { EOrderStatus } from '@/shared/enums/dashboard.enum';
import { OrderDetailsModal } from './order-details-modal';

const ICON_MAP: Record<string, React.ReactNode> = {
  Cart: <ICONS.Cart size={20} color="currentColor" className="text-muted-foreground" />,
  Market: <ICONS.Market size={20} color="currentColor" className="text-muted-foreground" />,
  WalletFigma: <ICONS.WalletFigma size={20} color="currentColor" className="text-muted-foreground" />,
  Bundles: <ICONS.Bundles size={20} color="currentColor" className="text-muted-foreground" />,
  Stonks: <ICONS.Stonks size={20} color="currentColor" className="text-muted-foreground" />,
};

export function HoRecaDashboardPage() {
  const { data: session } = authClient.useSession();
  const name = session?.user?.name?.split(' ')[0] ?? 'there';
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden flex flex-col">
      <div className="w-full bg-transparent px-10 py-5 flex items-center justify-between shrink-0">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
            HoReCa Overview
          </p>
          <h1 className="text-4xl font-bold tracking-tight">
            Welcome back, {name}!
          </h1>
        </div>
        <Button className="rounded-full gap-2" variant="default">
          <ICONS.Bundle size={16} color="currentColor" />
          Create Bundle
        </Button>
      </div>

      <div className="w-full px-10 py-4 flex flex-col lg:flex-row gap-[30px] flex-1 min-h-0">
        <div className="flex flex-col min-h-0">
          <h2 className="text-2xl font-semibold mb-3">Orders</h2>

          <div
            className="rounded-4xl border border-neutral-100 overflow-hidden flex flex-col bg-white"
            style={{ width: '1100px', height: '768px' }}
          >
            <div className="grid grid-cols-[0.8fr_0.8fr_1fr_1fr_0.8fr_1fr] px-5 py-3 border-b border-neutral-100 shrink-0">
              {['ORDER ID', 'ITEMS', 'DATE', 'STATUS', 'TOTAL', ''].map(col => (
                <span key={col} className="text-[14px] font-bold uppercase tracking-widest text-muted-foreground">
                  {col}
                </span>
              ))}
            </div>
            <div className="overflow-y-auto scrollbar-hide flex-1">
              {OrdersData.map((order, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[0.8fr_0.8fr_1fr_1fr_0.8fr_1fr] items-center px-5 py-3 border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors cursor-pointer"
                  onClick={() => setModalOpen(true)}
                >
                  <span className="text-14 font-medium">{order.id}</span>

                  <div className="flex items-center gap-1">
                    <div className="flex -space-x-2">
                      <div className="w-6 h-6 rounded-full bg-neutral-300 border-2 border-white" />
                      <div className="w-6 h-6 rounded-full bg-neutral-400 border-2 border-white" />
                    </div>
                    {order.items > 0 && (
                      <span className="text-[14px] text-muted-foreground ml-0.5">
                        +{order.items}
                      </span>
                    )}
                  </div>

                  <span className="text-14 text-muted-foreground">{order.date}</span>

                  <span className={`inline-flex w-fit px-2.5 py-0.5 rounded-full text-[14px] font-bold uppercase tracking-wide ${ORDER_STATUS_STYLES[order.status as EOrderStatus]}`}>
                    {order.status}
                  </span>

                  <span className="text-14 font-semibold">
                    ${order.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>

                  <Button
                    variant="secondary"
                    size="sm"
                    className="rounded-2xl gap-1 text-[14px] w-full h-10 px-3 bg-secondary/15 text-secondary hover:bg-secondary/25"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ICONS.RefreshLoading size={20} color="currentColor" />
                    Order again
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-[700px] shrink-0 flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-semibold mb-3">Statistics</h2>
            <div className="grid grid-cols-3 gap-3">
              {HoRecaStatsData.map(stat => (
                <div
                  key={stat.label}
                  className="relative rounded-3xl border border-neutral-100 p-8 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.08)] min-h-[208px]"
                >
                  <span className={`absolute top-3 right-3 text-[14px] font-semibold px-2 py-1 rounded-full ${stat.badgeColor}`}>
                    {stat.badge}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center mb-7">
                    {ICON_MAP[stat.icon]}
                  </div>
                  <p className="text-4xl font-normal tracking-tight">{stat.value}</p>
                  <p className="text-[13px] uppercase tracking-widest text-muted-foreground mt-5">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Active Projects</h2>
            <Carousel opts={{ align: 'start', dragFree: true }} className="w-full">
              <CarouselContent className="-ml-3">
                {ProjectsData.map((project, i) => (
                  <CarouselItem key={i} className="pl-2 basis-[150px]">
                    <div className="rounded-3xl border border-neutral-100 p-4 bg-white flex flex-col justify-between min-h-[160px]">
                      <div className="flex justify-end">
                        <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                          <ArrowUpRight className="w-4 h-4 text-secondary" />
                        </div>
                      </div>
                      <div>
                        <p className="text-xl font-semibold leading-tight">{project.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">{project.units} Units</p>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselNext className="right-0 top-1/2 w-10 h-10 bg-secondary/10 border-none hover:bg-secondary/20 text-secondary" />
            </Carousel>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-3">Curation Tools</h2>
            <div className="grid grid-cols-2 gap-4">
              {CurationToolsData.map(tool => (
                <div
                  key={tool.title}
                  className="rounded-3xl border border-neutral-100 p-3 bg-white flex items-center gap-2 cursor-pointer hover:bg-secondary/5 transition-colors min-h-[84px]"
                >
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
                    {ICON_MAP[tool.icon]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{tool.title}</p>
                    <p className="text-[11px] text-muted-foreground">{tool.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <OrderDetailsModal open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}