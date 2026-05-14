'use client';

import { authClient } from '@/lib';
import { Button } from '@/components/ui/shadcn/button';
import { ArrowUpRight, ArrowRight } from 'lucide-react';
import { ICONS } from '@/shared/data/icons';
import { ORDER_STATUS_STYLES } from '@/constants/dashboard.const';
import { OrdersData, HoRecaStatsData, ProjectsData, CurationToolsData } from '@/shared/data/dashboard';
import { EOrderStatus } from '@/shared/enums/dashboard.enum';

const ICON_MAP: Record<string, React.ReactNode> = {
  Cart: <ICONS.Cart size={20} color={"currentColor"} className={"text-muted-foreground"} />,
  Market: <ICONS.Market size={20} color={"currentColor"} className={"text-muted-foreground"} />,
  WalletFigma: <ICONS.WalletFigma size={20} color={"currentColor"} className={"text-muted-foreground"} />,
  Bundles: <ICONS.Bundles size={20} color={"currentColor"} className={"text-muted-foreground"} />,
  Stonks: <ICONS.Stonks size={20} color={"currentColor"} className={"text-muted-foreground"} />,
};

export function HoRecaDashboardPage() {
  const { data: session } = authClient.useSession();
  const name = session?.user?.name?.split(' ')[0] ?? 'there';

  return (
    <div className={"h-[calc(100vh-64px)] overflow-hidden"}>
      <div className={"container mx-auto px-6 py-8 flex flex-col lg:flex-row gap-10 h-full"}>

        {/* LEFT — Orders */}
        <div className={"flex-1 min-w-0 flex flex-col min-h-0"}>
          <div className={"flex items-start justify-between mb-5"}>
            <div>
              <p className={"text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1"}>
                HoReCa Overview
              </p>
              <h1 className={"text-2xl font-bold tracking-tight"}>
                Welcome back, {name}!
              </h1>
            </div>
            <Button className={"rounded-full gap-2"} variant={"default"}>
              <ICONS.Bundle size={16} color={"currentColor"} />
              Create Bundle
            </Button>
          </div>

          <h2 className={"text-lg font-semibold mb-3"}>Orders</h2>

          <div className={"rounded-2xl border border-neutral-100 overflow-hidden flex flex-col min-h-0 flex-1 max-w-[1000px]"}>
            <div className={"grid grid-cols-[0.8fr_0.8fr_1fr_1fr_0.8fr_1fr] px-5 py-3 border-b border-neutral-100 shrink-0"}>
              {['ORDER ID', 'ITEMS', 'DATE', 'STATUS', 'TOTAL', ''].map((col) => (
                <span key={col} className={"text-[10px] font-bold uppercase tracking-widest text-muted-foreground"}>
                  {col}
                </span>
              ))}
            </div>

            <div className={"overflow-y-auto flex-1"}>
              {OrdersData.map((order, i) => (
                <div
                  key={i}
                  className={"grid grid-cols-[0.8fr_0.8fr_1fr_1fr_0.8fr_1fr] items-center px-5 py-3 border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors"}
                >
                  <span className={"text-xs font-medium"}>{order.id}</span>

                  <div className={"flex items-center gap-1"}>
                    <div className={"flex -space-x-2"}>
                      <div className={"w-6 h-6 rounded-full bg-neutral-300 border-2 border-white"} />
                      <div className={"w-6 h-6 rounded-full bg-neutral-400 border-2 border-white"} />
                    </div>
                    {order.items > 0 && (
                      <span className={"text-[10px] text-muted-foreground ml-0.5"}>+{order.items}</span>
                    )}
                  </div>

                  <span className={"text-xs text-muted-foreground"}>{order.date}</span>

                  <span className={`inline-flex w-fit px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide ${ORDER_STATUS_STYLES[order.status as EOrderStatus]}`}>
                    {order.status}
                  </span>

                  <span className={"text-xs font-semibold"}>
                    ${order.total.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>

                  <Button variant={"secondary"} size={"sm"} className={"rounded-xl gap-1 text-[10px] w-fit h-7 px-2"}>
                    <ICONS.RefreshLoading size={10} color={"currentColor"} />
                    Order again
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT — Stats, Projects, Tools */}
        <div className={"w-full lg:w-[480px] shrink-0 flex flex-col gap-6"}>

          {/* Statistics — 3 колонки */}
          <div>
            <h2 className={"text-lg font-semibold mb-3"}>Statistics</h2>
            <div className={"grid grid-cols-3 gap-3"}>
              {HoRecaStatsData.map((stat) => (
                <div key={stat.label} className={"relative rounded-2xl border border-neutral-100 p-4 bg-white"}>
                  {stat.badge && (
                    <span className={`absolute top-2 right-2 text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${stat.badgeColor}`}>
                      {stat.badge}
                    </span>
                  )}
                  <div className={"mb-2"}>{ICON_MAP[stat.icon]}</div>
                  <p className={"text-xl font-bold"}>{stat.value}</p>
                  <p className={"text-[9px] uppercase tracking-widest text-muted-foreground mt-1"}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Active Projects */}
          <div>
            <h2 className={"text-lg font-semibold mb-3"}>Active Projects</h2>
            <div className={"flex gap-2 items-center"}>
              <div className={"flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth flex-1"}>
                {ProjectsData.map((project, i) => (
                  <div key={i} className={"shrink-0 w-[100px] rounded-2xl border border-neutral-100 p-3 bg-white"}>
                    <ArrowUpRight className={"w-3.5 h-3.5 text-muted-foreground mb-2"} />
                    <p className={"text-xs font-semibold leading-tight"}>{project.title}</p>
                    <p className={"text-[10px] text-muted-foreground mt-1"}>{project.units} Units</p>
                  </div>
                ))}
              </div>
              <button className={"shrink-0 w-8 h-8 rounded-full border border-neutral-200 flex items-center justify-center hover:bg-neutral-50 transition-colors"}>
                <ArrowRight className={"w-3.5 h-3.5"} />
              </button>
            </div>
          </div>

          {/* Curation Tools */}
          <div>
            <h2 className={"text-lg font-semibold mb-3"}>Curation Tools</h2>
            <div className={"grid grid-cols-2 gap-3"}>
              {CurationToolsData.map((tool) => (
                <div
                  key={tool.title}
                  className={"rounded-2xl border border-neutral-100 p-3 bg-white flex items-start gap-2 cursor-pointer hover:bg-neutral-50 transition-colors"}
                >
                  <div className={"w-7 h-7 rounded-xl bg-neutral-100 flex items-center justify-center shrink-0"}>
                    {ICON_MAP[tool.icon]}
                  </div>
                  <div>
                    <p className={"text-xs font-semibold"}>{tool.title}</p>
                    <p className={"text-[10px] text-muted-foreground"}>{tool.description}</p>
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