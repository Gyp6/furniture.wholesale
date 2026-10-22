'use client';

import { useQueryClient } from '@tanstack/react-query';
import { ArrowUpRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/shadcn/button';
import { ROUTES } from '@/constants';
import {
  useGetMyBundles,
  useGetReceivedOrders,
  useUpdateOrderStatus,
} from '@/hooks/queries';
import { useGetMyProducts } from '@/hooks/queries/catalog.query';
import { authClient } from '@/lib';
import { bundleService, productService } from '@/services';
import { ICONS } from '@/shared/data/icons';

import { OrderDetailsModal } from './order-details-modal';
import { SupplierInventory } from './supplier-inventory';
import {
  orderSubtotal,
  SupplierOrdersTable,
  TSupplierOrder,
} from './supplier-orders-table';

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

type TStat = {
  label: string;
  value: string | number;
  icon: string;
  badge?: string;
  badgeColor?: string;
};

function getErrorMessage(error: unknown): string {
  const err = error as { response?: { data?: { message?: string } } };
  return err.response?.data?.message || 'Failed to update status';
}

/** Wraps an async status update with cache invalidation and toasts. */
function useStatusUpdater(
  update: (id: string, status: string) => Promise<unknown>,
  queryKey: string,
  entity: string,
) {
  const queryClient = useQueryClient();
  return async (id: string, newStatus: string) => {
    try {
      await update(id, newStatus);
      queryClient.invalidateQueries({ queryKey: [queryKey] });
      toast.success(`${entity} status updated to ${newStatus}`);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };
}

function buildSupplierStats(
  orders: TSupplierOrder[] | undefined,
  activeBundles: number,
): TStat[] {
  const totalSales = (orders ?? [])
    .filter(order => order.status !== 'CANCELLED')
    .reduce((sum: number, order) => sum + orderSubtotal(order), 0);

  return [
    {
      label: 'Total Sales',
      value: `$${totalSales.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
      icon: 'Market',
      badge: '+18%',
      badgeColor: 'bg-green-100 text-green-700',
    },
    {
      label: 'Active Bundles',
      value: activeBundles,
      icon: 'OrganizationFigma',
    },
    {
      label: 'Orders Received',
      value: orders?.length ?? 0,
      icon: 'Cart',
      badge: 'New',
      badgeColor: 'bg-blue-100 text-blue-700',
    },
  ];
}

export function SupplierProfessionalDashboardPage() {
  const { data: session } = authClient.useSession();
  const name = session?.user?.name?.split(' ')[0] ?? 'there';
  const router = useRouter();

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showProducts, setShowProducts] = useState(false);

  const { data: rawOrders, isLoading: ordersLoading } = useGetReceivedOrders();
  const orders = rawOrders as TSupplierOrder[] | undefined;
  const { data: bundles, isLoading: bundlesLoading } =
    useGetMyBundles('SUPPLIER');
  const { data: products, isLoading: productsLoading } = useGetMyProducts();
  const { mutate: updateStatus } = useUpdateOrderStatus();

  const handleBundleStatusChange = useStatusUpdater(
    (id, status) => bundleService.update(id, { status } as never),
    'bundles',
    'Bundle',
  );
  const handleProductStatusChange = useStatusUpdater(
    (id, status) => productService.updateStatus(id, status),
    'products',
    'Product',
  );

  const activeBundlesCount =
    bundles?.filter(b => b.status === 'ACTIVE').length ?? 0;
  const liveStats = buildSupplierStats(orders, activeBundlesCount);

  const openOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setDetailsOpen(true);
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
            Supplier Overview
          </p>
          <h1 className={'text-3xl font-bold tracking-tight'}>
            Welcome back, {name}!
          </h1>
        </div>
        <div className={'flex items-center gap-3'}>
          <Button
            className={'rounded-full gap-2'}
            variant={'outline'}
            onClick={() => router.push('/product/create')}
          >
            <ICONS.Cart
              size={16}
              color={'currentColor'}
            />
            Add New Product
          </Button>
          <Button
            className={'rounded-full gap-2'}
            variant={'default'}
            onClick={() => router.push('/bundle-create')}
          >
            <ICONS.Bundles
              size={16}
              color={'currentColor'}
            />
            Add New Bundle
          </Button>
        </div>
      </div>

      <div
        className={
          'w-full px-10 py-4 flex flex-col lg:flex-row gap-[30px] flex-1 min-h-0 items-stretch'
        }
      >
        <SupplierOrdersTable
          orders={orders}
          loading={ordersLoading}
          updateStatus={updateStatus}
          onOpen={openOrder}
        />

        <div
          className={'lg:w-[600px] w-full shrink-0 flex flex-col gap-4 min-h-0'}
        >
          <SupplierInventory
            showProducts={showProducts}
            onToggle={() => setShowProducts(!showProducts)}
            productsLoading={productsLoading}
            bundlesLoading={bundlesLoading}
            products={products}
            bundles={bundles}
            onProductStatusChange={handleProductStatusChange}
            onBundleStatusChange={handleBundleStatusChange}
          />

          <div className={'grid grid-cols-3 gap-4 shrink-0'}>
            {liveStats.map(stat => (
              <div
                key={stat.label}
                className={
                  'relative rounded-2xl border border-neutral-100 p-5 bg-white min-h-[130px] shadow-[0_8px_40px_rgba(0,0,0,0.08)]'
                }
              >
                {stat.badge && (
                  <span
                    className={`absolute top-2.5 right-2.5 text-[12px] font-semibold px-1.5 py-0.5 rounded-full ${stat.badgeColor}`}
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
                    'text-[12px] uppercase tracking-widest text-muted-foreground mt-1'
                  }
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>

          <div
            className={
              'rounded-2xl border border-neutral-100 bg-white p-5 flex items-center justify-between shrink-0 shadow-[0_8px_40px_rgba(0,0,0,0.08)]'
            }
          >
            <div>
              <p className={'text-lg font-semibold'}>Profile Completeness</p>
              <p className={'text-sm text-muted-foreground mt-0.5'}>
                Increase visibility by finishing your setup.
              </p>
            </div>
            <button
              className={
                'w-11 h-11 rounded-full bg-foreground flex items-center justify-center shrink-0 hover:bg-foreground/80 transition-colors'
              }
              onClick={() => router.push(ROUTES.PROFILE)}
            >
              <ArrowUpRight className={'w-5 h-5 text-background'} />
            </button>
          </div>
        </div>
      </div>

      <OrderDetailsModal
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        orderId={selectedOrderId}
      />
    </div>
  );
}
