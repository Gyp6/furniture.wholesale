'use client';

import { useQueryClient } from '@tanstack/react-query';
import { ArrowUpRight, Check, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/shadcn/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/shadcn/select';
import { Skeleton } from '@/components/ui/shadcn/skeleton';
import { ROUTES } from '@/constants';
import {
  CATEGORY_STYLES,
  ORDER_STATUS_STYLES,
} from '@/constants/dashboard.const';
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

export function SupplierProfessionalDashboardPage() {
  const { data: session } = authClient.useSession();
  const name = session?.user?.name?.split(' ')[0] ?? 'there';
  const router = useRouter();

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [showProducts, setShowProducts] = useState(false);

  const { data: rawOrders, isLoading: ordersLoading } = useGetReceivedOrders();
  const orders = rawOrders as any[] | undefined;
  const { data: bundles, isLoading: bundlesLoading } =
    useGetMyBundles('SUPPLIER');
  const { data: products, isLoading: productsLoading } = useGetMyProducts();
  const { mutate: updateStatus } = useUpdateOrderStatus();

  const queryClient = useQueryClient();

  const handleBundleStatusChange = async (
    bundleId: string,
    newStatus: string,
  ) => {
    try {
      await bundleService.update(bundleId, { status: newStatus } as any);
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
      toast.success(`Bundle status updated to ${newStatus}`);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleProductStatusChange = async (
    productId: string,
    newStatus: string,
  ) => {
    try {
      await productService.updateStatus(productId, newStatus);
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(`Product status updated to ${newStatus}`);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  // Compute stats dynamically from real data
  const totalSales = orders
    ? orders
        .filter(o => o.status !== 'CANCELLED')
        .reduce(
          (sum: number, o: any) =>
            sum +
            o.items.reduce(
              (s: number, it: any) => s + it.priceSnapshot * it.quantity,
              0,
            ),
          0,
        )
    : 0;

  const activeBundlesCount = bundles
    ? bundles.filter(b => b.status === 'ACTIVE').length
    : 0;

  const totalOrders = orders?.length ?? 0;

  const liveStats = [
    {
      label: 'Total Sales',
      value: `$${totalSales.toLocaleString('en-US', { maximumFractionDigits: 0 })}`,
      icon: 'Market',
      badge: '+18%',
      badgeColor: 'bg-green-100 text-green-700',
    },
    {
      label: 'Active Bundles',
      value: activeBundlesCount,
      icon: 'OrganizationFigma',
    },
    {
      label: 'Orders Received',
      value: totalOrders,
      icon: 'Cart',
      badge: 'New',
      badgeColor: 'bg-blue-100 text-blue-700',
    },
  ];

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
        <div className={'flex flex-col min-h-0 flex-1'}>
          <h2 className={'text-2xl font-semibold mb-3'}>Orders</h2>

          <div
            className={
              'rounded-2xl border border-neutral-100 overflow-hidden flex flex-col min-h-0 flex-1 bg-white shadow-[0_8px_40px_rgba(0,0,0,0.08)]'
            }
          >
            <div
              className={
                'grid grid-cols-[0.8fr_1.2fr_0.8fr_1fr_1fr_0.8fr_1.2fr] px-5 py-3 border-b border-neutral-100 shrink-0'
              }
            >
              {[
                'ORDER ID',
                'CLIENT',
                'ITEMS',
                'DATE',
                'STATUS',
                'TOTAL',
                'ACTIONS',
              ].map(col => (
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
                    <Skeleton
                      key={i}
                      className={'h-12 rounded-xl'}
                    />
                  ))}
                </div>
              ) : orders && orders.length > 0 ? (
                orders.map((order, i) => {
                  const subTotal = order.items.reduce(
                    (sum: number, item: any) =>
                      sum + item.priceSnapshot * item.quantity,
                    0,
                  );
                  return (
                    <div
                      key={order.id || i}
                      className={
                        'grid grid-cols-[0.8fr_1.2fr_0.8fr_1fr_1fr_0.8fr_1.2fr] items-center px-5 py-3 border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors cursor-pointer'
                      }
                      onClick={() => {
                        setSelectedOrderId(order.id);
                        setDetailsOpen(true);
                      }}
                    >
                      <span
                        className={'text-sm font-medium text-muted-foreground'}
                      >
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>

                      <div className={'flex flex-col min-w-0'}>
                        <span
                          className={
                            'text-sm font-semibold text-neutral-800 truncate'
                          }
                        >
                          {order.buyer?.profile?.company?.name ||
                            order.buyer?.name ||
                            'Individual client'}
                        </span>
                        <span
                          className={
                            'text-[11px] text-muted-foreground truncate'
                          }
                        >
                          {order.buyer?.email}
                        </span>
                      </div>

                      <div className={'flex items-center gap-1'}>
                        <div className={'flex -space-x-2'}>
                          <div
                            className={
                              'w-6 h-6 rounded-full bg-neutral-300 border-2 border-white'
                            }
                          />
                        </div>
                        <span
                          className={'text-[14px] text-muted-foreground ml-0.5'}
                        >
                          {order.items?.length || 0} items
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
                        className={`inline-flex w-fit px-2.5 py-0.5 rounded-full text-[14px] font-bold uppercase tracking-wide ${ORDER_STATUS_STYLES[order.status] ?? 'bg-neutral-100 text-neutral-700'}`}
                      >
                        {order.status}
                      </span>

                      <span className={'text-sm font-semibold'}>
                        $
                        {subTotal.toLocaleString('en-US', {
                          minimumFractionDigits: 2,
                        })}
                      </span>

                      {order.status === 'NEW' ? (
                        <div
                          className={'flex items-center gap-2'}
                          onClick={e => e.stopPropagation()}
                        >
                          <button
                            className={
                              'w-10 h-10 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-200 transition-colors'
                            }
                            onClick={() => {
                              toast.promise(
                                new Promise((resolve, reject) => {
                                  updateStatus(
                                    { id: order.id, status: 'PROCESSING' },
                                    { onSuccess: resolve, onError: reject },
                                  );
                                }),
                                {
                                  loading: 'Confirming order...',
                                  success:
                                    'Order confirmed! Stock has been updated.',
                                  error: 'Failed to confirm order.',
                                },
                              );
                            }}
                          >
                            <Check className={'w-5 h-5 text-green-600'} />
                          </button>
                          <button
                            className={
                              'w-10 h-10 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors'
                            }
                            onClick={() => {
                              toast.promise(
                                new Promise((resolve, reject) => {
                                  updateStatus(
                                    { id: order.id, status: 'CANCELLED' },
                                    { onSuccess: resolve, onError: reject },
                                  );
                                }),
                                {
                                  loading: 'Rejecting order...',
                                  success: 'Order has been rejected.',
                                  error: 'Failed to reject order.',
                                },
                              );
                            }}
                          >
                            <X className={'w-5 h-5 text-red-500'} />
                          </button>
                        </div>
                      ) : order.status === 'PROCESSING' ? (
                        <div
                          className={'flex items-center'}
                          onClick={e => e.stopPropagation()}
                        >
                          <Button
                            variant={'outline'}
                            size={'sm'}
                            className={
                              'rounded-2xl text-[12px] h-8 bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
                            }
                            onClick={() => {
                              toast.promise(
                                new Promise((resolve, reject) => {
                                  updateStatus(
                                    { id: order.id, status: 'SHIPPED' },
                                    { onSuccess: resolve, onError: reject },
                                  );
                                }),
                                {
                                  loading: 'Marking as shipped...',
                                  success: 'Order marked as shipped!',
                                  error: 'Failed to update order.',
                                },
                              );
                            }}
                          >
                            Mark Shipped
                          </Button>
                        </div>
                      ) : (
                        <div />
                      )}
                    </div>
                  );
                })
              ) : (
                <div
                  className={
                    'flex items-center justify-center h-full py-12 text-muted-foreground text-sm'
                  }
                >
                  No orders received yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div
          className={'lg:w-[600px] w-full shrink-0 flex flex-col gap-4 min-h-0'}
        >
          <div
            className={
              'rounded-2xl bg-white overflow-hidden flex flex-col shadow-[0_8px_40px_rgba(0,0,0,0.08)]'
            }
            style={{ height: '300px' }}
          >
            <div
              className={'flex items-center justify-between px-5 py-4 shrink-0'}
            >
              <h2 className={'text-xl font-semibold'}>
                {showProducts ? 'Items Inventory' : 'Bundles Inventory'}
              </h2>
              <Button
                variant={'secondary'}
                className={
                  'rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 border-0'
                }
                style={{ width: '178px', height: '48px' }}
                onClick={() => setShowProducts(!showProducts)}
              >
                {showProducts ? 'Bundles Inventory' : 'Items Inventory'}
              </Button>
            </div>

            <div
              className={
                'grid grid-cols-[2fr_1fr_0.8fr_0.8fr_0.6fr] px-5 py-3 border-y border-neutral-50 shrink-0'
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
                    'text-[12px] font-bold uppercase tracking-widest text-muted-foreground'
                  }
                >
                  {col}
                </span>
              ))}
            </div>

            <div className={'overflow-y-auto scrollbar-hide flex-1'}>
              {(showProducts ? productsLoading : bundlesLoading) ? (
                <div className={'flex flex-col gap-2 p-4'}>
                  {[...Array(3)].map((_, i) => (
                    <Skeleton
                      key={i}
                      className={'h-10 rounded-xl'}
                    />
                  ))}
                </div>
              ) : showProducts ? (
                products && products.length > 0 ? (
                  products.map((product, i) => {
                    const categoryTitle =
                      product.category?.title || 'Uncategorized';
                    return (
                      <div
                        key={product.id || i}
                        className={
                          'grid grid-cols-[2fr_1fr_0.8fr_0.8fr_0.6fr] items-center px-5 py-3 border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors cursor-pointer'
                        }
                        onClick={() => {
                          router.push(`/product/${product.id}/edit`);
                        }}
                      >
                        <div className={'flex items-center gap-2'}>
                          <span
                            className={
                              'text-sm font-medium text-muted-foreground leading-tight line-clamp-1'
                            }
                          >
                            {product.title}
                          </span>
                        </div>

                        <span
                          className={`inline-flex w-fit px-2 py-0.5 rounded-full text-[12px] font-semibold ${CATEGORY_STYLES[categoryTitle] ?? 'bg-neutral-100 text-neutral-600'}`}
                        >
                          {categoryTitle}
                        </span>

                        <span className={'text-sm text-muted-foreground'}>
                          {product.stock} units
                        </span>

                        <div
                          className={'flex items-center'}
                          onClick={e => e.stopPropagation()}
                        >
                          <Select
                            value={product.status}
                            onValueChange={value =>
                              handleProductStatusChange(product.id, value)
                            }
                          >
                            <SelectTrigger
                              className={
                                'h-7 w-[110px] text-xs border-0 bg-transparent px-1 gap-1'
                              }
                            >
                              <div className={'flex items-center gap-1'}>
                                <div
                                  className={`w-1.5 h-1.5 rounded-full ${product.status === 'ACTIVE' ? 'bg-green-500' : product.status === 'DRAFT' ? 'bg-yellow-500' : 'bg-neutral-300'}`}
                                />
                                <SelectValue />
                              </div>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value={'ACTIVE'}>Active</SelectItem>
                              <SelectItem value={'INACTIVE'}>
                                Inactive
                              </SelectItem>
                              <SelectItem value={'DRAFT'}>Draft</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className={'flex items-center gap-2'}>
                          <button
                            className={
                              'w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center hover:bg-secondary/20 transition-colors'
                            }
                            onClick={e => {
                              e.stopPropagation();
                              router.push(`/product/${product.id}/edit`);
                            }}
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
                            onClick={e => {
                              e.stopPropagation();
                              // TODO: Delete product
                            }}
                          >
                            <ICONS.TrashFigma
                              size={14}
                              color={'currentColor'}
                              className={'text-red-500'}
                            />
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div
                    className={
                      'flex items-center justify-center h-full py-8 text-muted-foreground text-sm'
                    }
                  >
                    No products in inventory.
                  </div>
                )
              ) : bundles && bundles.length > 0 ? (
                bundles.map((bundle, i) => {
                  const itemsCount = bundle.items?.length || 0;
                  const categoryTitle = bundle.space?.title || 'Hotel Room';
                  return (
                    <div
                      key={bundle.id || i}
                      className={
                        'grid grid-cols-[2fr_1fr_0.8fr_0.8fr_0.6fr] items-center px-5 py-3 border-b border-neutral-50 last:border-0 hover:bg-neutral-50 transition-colors'
                      }
                    >
                      <div className={'flex items-center gap-2'}>
                        <span
                          className={
                            'text-sm font-medium text-muted-foreground leading-tight line-clamp-1'
                          }
                        >
                          {bundle.name}
                        </span>
                      </div>

                      <span
                        className={`inline-flex w-fit px-2 py-0.5 rounded-full text-[12px] font-semibold ${CATEGORY_STYLES[categoryTitle] ?? 'bg-neutral-100 text-neutral-600'}`}
                      >
                        {categoryTitle}
                      </span>

                      <span className={'text-sm text-muted-foreground'}>
                        {itemsCount} units
                      </span>

                      <div className={'flex items-center'}>
                        <Select
                          value={bundle.status}
                          onValueChange={value =>
                            handleBundleStatusChange(bundle.id, value)
                          }
                        >
                          <SelectTrigger
                            className={
                              'h-7 w-[110px] text-xs border-0 bg-transparent px-1 gap-1'
                            }
                          >
                            <div className={'flex items-center gap-1'}>
                              <div
                                className={`w-1.5 h-1.5 rounded-full ${bundle.status === 'ACTIVE' ? 'bg-green-500' : bundle.status === 'DRAFT' ? 'bg-yellow-500' : 'bg-neutral-300'}`}
                              />
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={'ACTIVE'}>Active</SelectItem>
                            <SelectItem value={'INACTIVE'}>Inactive</SelectItem>
                            <SelectItem value={'DRAFT'}>Draft</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className={'flex items-center gap-2'}>
                        <button
                          className={
                            'w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center hover:bg-secondary/20 transition-colors'
                          }
                          onClick={() =>
                            router.push(`/bundle-edit/${bundle.id}`)
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
                  );
                })
              ) : (
                <div
                  className={
                    'flex items-center justify-center h-full py-8 text-muted-foreground text-sm'
                  }
                >
                  No bundles in inventory.
                </div>
              )}
            </div>
          </div>

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
