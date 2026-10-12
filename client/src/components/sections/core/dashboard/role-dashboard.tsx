'use client';

import { ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
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
import { useGetMyBundles, useGetMyOrders } from '@/hooks/queries';
import { authClient } from '@/lib';
import { CurationToolsData } from '@/shared/data/dashboard';
import { ICONS } from '@/shared/data/icons';
import { EOrderStatus } from '@/shared/enums/dashboard.enum';
import { useSpaceBundleStore } from '@/store/use-space-bundle.store';
import { useUnsavedChangesStore } from '@/store/use-unsaved-changes.store';

import { OrderDetailsModal } from './order-details-modal';
import { OutOfStockModal } from './out-of-stock-modal';

export type DashboardOrders = ReturnType<typeof useGetMyOrders>['data'];
export type DashboardBundles = ReturnType<typeof useGetMyBundles>['data'];
type Order = NonNullable<DashboardOrders>[number];
type Bundle = NonNullable<DashboardBundles>[number];

export interface DashboardStat {
  label: string;
  value: string | number;
  icon: string;
  badge: string;
  badgeColor: string;
}

export interface RoleDashboardProps {
  overviewLabel: string;
  unsavedRedirectPath: string;
  statsGridClass: string;
  projectsTitle?: string;
  emptyProjectsText?: string;
  outOfStockOnReorder?: boolean;
  buildStats: (
    orders: DashboardOrders,
    bundles: DashboardBundles,
  ) => DashboardStat[];
}

const iconProps = {
  size: 20,
  color: 'currentColor',
  className: 'text-muted-foreground',
};

const ICON_MAP: Record<string, React.ReactNode> = {
  Cart: <ICONS.Cart {...iconProps} />,
  Market: <ICONS.Market {...iconProps} />,
  WalletFigma: <ICONS.WalletFigma {...iconProps} />,
  Bundles: <ICONS.Bundles {...iconProps} />,
  Stonks: <ICONS.Stonks {...iconProps} />,
};

const CARD_CLASS =
  'rounded-2xl border border-neutral-100 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.08)]';

const ORDER_SKELETON_IDS = ['o1', 'o2', 'o3', 'o4', 'o5'];
const PROJECT_SKELETON_IDS = ['p1', 'p2', 'p3'];

function activateOnKey(action: () => void) {
  return (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.target !== e.currentTarget) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      action();
    }
  };
}

function OrderRow({
  order,
  onSelect,
  onReorder,
}: {
  order: Order;
  onSelect: (id: string) => void;
  onReorder: (id: string) => void;
}) {
  const itemsCount =
    order.subOrders?.reduce((s, so) => s + so.items.length, 0) ?? 0;

  return (
    <div
      role={'button'}
      tabIndex={0}
      className={
        'grid grid-cols-[0.8fr_0.8fr_1fr_1fr_0.8fr_1fr] items-center px-5 py-3 border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors cursor-pointer'
      }
      onClick={() => onSelect(order.id)}
      onKeyDown={activateOnKey(() => onSelect(order.id))}
    >
      <span className={'text-sm font-medium text-muted-foreground'}>
        #{order.id.slice(0, 8).toUpperCase()}
      </span>

      <div className={'flex items-center gap-1'}>
        <div className={'flex -space-x-2'}>
          <div
            className={'w-6 h-6 rounded-full bg-neutral-300 border-2 border-white'}
          />
        </div>
        <span className={'text-[14px] text-muted-foreground ml-0.5'}>
          {itemsCount} items
        </span>
      </div>

      <span className={'text-sm text-muted-foreground'}>
        {new Date(order.createdAt).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })}
      </span>

      <span
        className={`inline-flex w-fit px-2.5 py-0.5 rounded-full text-[14px] font-bold uppercase tracking-wide ${ORDER_STATUS_STYLES[order.status as EOrderStatus] ?? 'bg-neutral-100 text-neutral-700'}`}
      >
        {order.status}
      </span>

      <span className={'text-sm font-semibold'}>
        $
        {(order.totalAmount ?? 0).toLocaleString('en-US', {
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
          onReorder(order.id);
        }}
      >
        <ICONS.RefreshLoading
          size={20}
          color={'currentColor'}
        />
        Order again
      </Button>
    </div>
  );
}

function OrdersBody({
  orders,
  isLoading,
  onSelect,
  onReorder,
}: {
  orders: DashboardOrders;
  isLoading: boolean;
  onSelect: (id: string) => void;
  onReorder: (id: string) => void;
}) {
  if (isLoading) {
    return (
      <div className={'flex flex-col gap-2 p-4'}>
        {ORDER_SKELETON_IDS.map(id => (
          <Skeleton
            key={id}
            className={'h-12 rounded-xl'}
          />
        ))}
      </div>
    );
  }
  if (!orders || orders.length === 0) {
    return (
      <div
        className={
          'flex items-center justify-center h-full py-12 text-muted-foreground text-sm'
        }
      >
        No orders yet. Start shopping!
      </div>
    );
  }
  return (
    <>
      {orders.map(order => (
        <OrderRow
          key={order.id}
          order={order}
          onSelect={onSelect}
          onReorder={onReorder}
        />
      ))}
    </>
  );
}

function OrdersSection({
  orders,
  isLoading,
  onSelect,
  onReorder,
}: {
  orders: DashboardOrders;
  isLoading: boolean;
  onSelect: (id: string) => void;
  onReorder: (id: string) => void;
}) {
  return (
    <div className={'flex flex-col min-h-0 flex-1'}>
      <h2 className={'text-2xl font-semibold mb-3'}>Orders</h2>
      <div className={`${CARD_CLASS} overflow-hidden flex flex-col min-h-0 flex-1`}>
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
          <OrdersBody
            orders={orders}
            isLoading={isLoading}
            onSelect={onSelect}
            onReorder={onReorder}
          />
        </div>
      </div>
    </div>
  );
}

function StatsSection({
  stats,
  gridClass,
}: {
  stats: DashboardStat[];
  gridClass: string;
}) {
  return (
    <div>
      <h2 className={'text-2xl font-semibold mb-3'}>Statistics</h2>
      <div className={gridClass}>
        {stats.map(stat => (
          <div
            key={stat.label}
            className={`relative ${CARD_CLASS} p-5 min-h-[130px]`}
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
            <p className={'text-3xl font-bold tracking-tight'}>{stat.value}</p>
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
  );
}

function ProjectCard({
  bundle,
  onOpen,
}: {
  bundle: Bundle;
  onOpen: (bundle: Bundle) => void;
}) {
  return (
    <div
      role={'button'}
      tabIndex={0}
      className={`${CARD_CLASS} p-4 flex flex-col justify-between min-h-[160px] cursor-pointer hover:bg-secondary/5 transition-colors`}
      onClick={() => onOpen(bundle)}
      onKeyDown={activateOnKey(() => onOpen(bundle))}
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
  );
}

function ProjectsBody({
  bundles,
  isLoading,
  onOpen,
  emptyText,
}: {
  bundles: DashboardBundles;
  isLoading: boolean;
  onOpen: (bundle: Bundle) => void;
  emptyText: string;
}) {
  if (isLoading) {
    return (
      <div className={'flex gap-2'}>
        {PROJECT_SKELETON_IDS.map(id => (
          <Skeleton
            key={id}
            className={'w-[150px] h-[160px] rounded-2xl shrink-0'}
          />
        ))}
      </div>
    );
  }
  if (!bundles || bundles.length === 0) {
    return (
      <p className={'text-sm text-muted-foreground'}>{emptyText}</p>
    );
  }
  return (
    <Carousel
      opts={{ align: 'start', dragFree: true }}
      className={'w-full'}
    >
      <CarouselContent className={'-ml-3'}>
        {bundles.map(bundle => (
          <CarouselItem
            key={bundle.id}
            className={'pl-2 basis-[150px]'}
          >
            <ProjectCard
              bundle={bundle}
              onOpen={onOpen}
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext
        className={
          'right-0 top-1/2 w-10 h-10 bg-secondary/10 border-none hover:bg-secondary/20 text-secondary'
        }
      />
    </Carousel>
  );
}

function CurationTools() {
  return (
    <div>
      <h2 className={'text-2xl font-semibold mb-3'}>Curation Tools</h2>
      <div className={'grid grid-cols-2 gap-4'}>
        {CurationToolsData.map(tool => (
          <div
            key={tool.title}
            className={`${CARD_CLASS} p-3 flex items-center gap-2 cursor-pointer hover:bg-secondary/5 transition-colors min-h-[84px]`}
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
  );
}

export function RoleDashboard({
  overviewLabel,
  unsavedRedirectPath,
  statsGridClass,
  projectsTitle = 'Active Projects',
  emptyProjectsText = 'No active projects yet.',
  outOfStockOnReorder = false,
  buildStats,
}: RoleDashboardProps) {
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
  const [outOfStockOpen, setOutOfStockOpen] = useState(false);

  const { data: orders, isLoading: ordersLoading } = useGetMyOrders();
  const { data: bundles, isLoading: bundlesLoading } = useGetMyBundles('USER');

  const openOrder = (id: string) => {
    setSelectedOrderId(id);
    setModalOpen(true);
  };

  const reorderOrder = (id: string) => {
    if (outOfStockOnReorder) {
      setOutOfStockOpen(true);
      return;
    }
    openOrder(id);
  };

  const openBundle = (bundle: Bundle) => {
    setActiveBundle(bundle);
    router.push('/cart');
  };

  const createBundle = () => {
    const leaveAndReset = () => {
      clearBundle();
      router.push('/');
    };
    if (items.length > 0 && activeBundleId === null) {
      showUnsavedChanges(unsavedRedirectPath, leaveAndReset);
      return;
    }
    leaveAndReset();
  };

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
            {overviewLabel}
          </p>
          <h1 className={'text-3xl font-bold tracking-tight'}>
            Welcome back, {name}!
          </h1>
        </div>
        <Button
          className={'rounded-full gap-2'}
          variant={'default'}
          onClick={createBundle}
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
        <OrdersSection
          orders={orders}
          isLoading={ordersLoading}
          onSelect={openOrder}
          onReorder={reorderOrder}
        />

        <div
          className={'lg:w-[600px] w-full shrink-0 flex flex-col gap-4 min-h-0'}
        >
          <StatsSection
            stats={buildStats(orders, bundles)}
            gridClass={statsGridClass}
          />
          <div>
            <h2 className={'text-2xl font-semibold mb-3'}>{projectsTitle}</h2>
            <ProjectsBody
              bundles={bundles}
              isLoading={bundlesLoading}
              onOpen={openBundle}
              emptyText={emptyProjectsText}
            />
          </div>
          <CurationTools />
        </div>
      </div>

      {outOfStockOnReorder && (
        <OutOfStockModal
          open={outOfStockOpen}
          onOpenChange={setOutOfStockOpen}
          onPlaceOrder={() => setOutOfStockOpen(false)}
        />
      )}

      <OrderDetailsModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        orderId={selectedOrderId}
      />
    </div>
  );
}
