'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeft, Package, Clock, CheckCircle2, XCircle, AlertCircle, Building2, User, Truck } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/shadcn/button';
import { Card } from '@/components/ui/shadcn/card';
import { Skeleton } from '@/components/ui/shadcn/skeleton';
import { Badge } from '@/components/ui/shadcn/badge';
import { useGetOrder, useUpdateOrderStatus } from '@/hooks/queries';
import { useAuthStatus } from '@/hooks/use-auth-status.hook';
import { useSpaceBundleStore } from '@/store/use-space-bundle.store';
import { ICONS } from '@/shared/data/icons';
import Image from 'next/image';
import { ROUTES } from '@/constants';

const ORDER_STATUS_CONFIG = {
  NEW: { label: 'New', color: 'bg-blue-100 text-blue-700', icon: Clock },
  CONFIRMED: { label: 'Confirmed', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  PROCESSING: { label: 'Processing', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
  SHIPPED: { label: 'Shipped', color: 'bg-purple-100 text-purple-700', icon: Truck },
  DELIVERED: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
};

interface Props {
  params: Promise<{ id: string }>;
}

export function OrderDetailPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { data: order, isLoading, isError } = useGetOrder(id);
  const { user } = useAuthStatus();
  const { clearBundle, addItem } = useSpaceBundleStore();
  const { mutate: updateStatus } = useUpdateOrderStatus();

  const isSupplier = user?.role === 'SUPPLIER' || user?.role === 'ADMIN';
  const orderData = order as any;
  const isSubOrder = orderData && !('subOrders' in orderData);

  const handleReorder = () => {
    if (!order) return;

    const orderItems = 'subOrders' in order && order.subOrders
      ? (order.subOrders as any[]).flatMap((sub) => sub.items as any[])
      : ((order as any).items as any[] || []);

    if (orderItems.length === 0) {
      toast.error('No items to reorder');
      return;
    }

    clearBundle();
    for (const item of orderItems) {
      if (!item.product) continue;
      addItem({
        product: item.product,
        quantity: item.quantity,
      });
    }
    toast.success('Items added to cart!');
    router.push('/cart');
  };

  const handleStatusUpdate = (newStatus: string, messages: { loading: string; success: string; error: string }) => {
    toast.promise(
      new Promise((resolve, reject) => {
        updateStatus(
          { id, status: newStatus },
          { onSuccess: resolve, onError: reject },
        );
      }),
      messages,
    );
  };

  if (isLoading) {
    return (
      <div className={"w-full max-w-6xl mx-auto p-6 space-y-6"}>
        <Skeleton className={"h-10 w-full"} />
        <Skeleton className={"h-64 w-full rounded-[30px]"} />
        <Skeleton className={"h-96 w-full rounded-[30px]"} />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className={"w-full max-w-6xl mx-auto p-6"}>
        <div className={"flex flex-col items-center justify-center p-16 bg-white rounded-[30px]"}>
          <XCircle className={"w-16 h-16 text-red-500 mb-4"} />
          <h3 className={"text-xl font-medium mb-2"}>Order not found</h3>
          <p className={"text-muted-foreground mb-6"}>Please check the link</p>
          <Button onClick={() => router.push('/orders')}>
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = ORDER_STATUS_CONFIG[order.status as keyof typeof ORDER_STATUS_CONFIG] || ORDER_STATUS_CONFIG.NEW;
  const StatusIcon = statusConfig.icon;

  const renderActionButtons = () => {
    if (isSubOrder && isSupplier) {
      if (orderData.status === 'NEW') {
        return (
          <div className={"flex items-center gap-3"}>
            <Button
              variant={"default"}
              className={"rounded-full h-11 gap-2 px-6 bg-green-600 hover:bg-green-700"}
              onClick={() => handleStatusUpdate('PROCESSING', {
                loading: 'Confirming order...',
                success: 'Order confirmed! Stock has been updated.',
                error: 'Failed to confirm order.',
              })}
            >
              <CheckCircle2 className={"w-4 h-4"} />
              Confirm Order
            </Button>
            <Button
              variant={"outline"}
              className={"rounded-full h-11 gap-2 px-6 text-red-600 border-red-200 hover:bg-red-50"}
              onClick={() => handleStatusUpdate('CANCELLED', {
                loading: 'Rejecting order...',
                success: 'Order has been rejected.',
                error: 'Failed to reject order.',
              })}
            >
              <XCircle className={"w-4 h-4"} />
              Reject
            </Button>
          </div>
        );
      }
      if (orderData.status === 'PROCESSING') {
        return (
          <Button
            variant={"default"}
            className={"rounded-full h-11 gap-2 px-6 bg-blue-600 hover:bg-blue-700"}
            onClick={() => handleStatusUpdate('SHIPPED', {
              loading: 'Marking as shipped...',
              success: 'Order marked as shipped!',
              error: 'Failed to update order.',
            })}
          >
            <Truck className={"w-4 h-4"} />
            Mark Shipped
          </Button>
        );
      }
    }

    if (!isSubOrder && !isSupplier && orderData?.status === 'SHIPPED') {
      return (
        <Button
          variant={"default"}
          className={"rounded-full h-11 gap-2 px-6 bg-green-600 hover:bg-green-700"}
          onClick={() => handleStatusUpdate('DELIVERED', {
            loading: 'Marking as delivered...',
            success: 'Order marked as delivered!',
            error: 'Failed to update order.',
          })}
        >
          <CheckCircle2 className={"w-4 h-4"} />
          Mark Delivered
        </Button>
      );
    }

    return null;
  };

  if (isSubOrder) {
    const items = (order as any).items as any[] || [];
    const subTotal = items.reduce((sum: number, item: any) => sum + item.quantity * item.priceSnapshot, 0);
    const buyer = (order as any).buyer;

    return (
      <div className={"w-full max-w-6xl mx-auto p-6 space-y-6"}>
        <Button
          variant={"ghost"}
          className={"mb-4"}
          onClick={() => router.push('/orders')}
        >
          <ArrowLeft className={"w-4 h-4 mr-2"} />
          Back to Orders
        </Button>

        <div className={"bg-white rounded-[30px] p-8 shadow-md space-y-6"}>
          <div className={"flex items-start justify-between"}>
            <div className={"space-y-2"}>
              <h1 className={"text-3xl font-medium tracking-tight"}>
                Sub-order #{order.id.slice(0, 8)}
              </h1>
              <p className={"text-muted-foreground"}>
                Created {format(new Date(order.createdAt), 'dd MMMM yyyy, HH:mm')}
              </p>
              {buyer && (
                <div className={"flex items-center gap-2 text-sm text-muted-foreground"}>
                  <User className={"w-4 h-4"} />
                  <span>{buyer.profile?.company?.name || buyer.name}</span>
                  {buyer.email && <span className={"text-xs"}>({buyer.email})</span>}
                </div>
              )}
            </div>
            <Badge className={`${statusConfig.color} flex items-center gap-2 px-4 py-2 text-base`}>
              <StatusIcon className={"w-4 h-4"} />
              {statusConfig.label}
            </Badge>
          </div>

          <div className={"flex items-center gap-3"}>
            {renderActionButtons()}
          </div>

          <div className={"grid grid-cols-1 md:grid-cols-2 gap-6 pt-4"}>
            <Card className={"p-6 border-0 bg-neutral-50 rounded-[20px]"}>
              <p className={"text-sm text-muted-foreground mb-2"}>Sub-order Total</p>
              <p className={"text-2xl font-bold"}>${subTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </Card>
            <Card className={"p-6 border-0 bg-neutral-50 rounded-[20px]"}>
              <p className={"text-sm text-muted-foreground mb-2"}>Items</p>
              <p className={"text-2xl font-bold"}>{items.length}</p>
            </Card>
          </div>
        </div>

        <div className={"space-y-4"}>
          <h2 className={"text-2xl font-medium"}>Items</h2>
          <Card className={"bg-white rounded-[30px] p-6 border-0 shadow-md space-y-3"}>
            {items.map((item: any) => {
              const imgSrc = item.product?.images?.[0]
                ? item.product.images[0].startsWith('http')
                  ? item.product.images[0]
                  : ROUTES.S3(item.product.images[0])
                : '/placeholder.png';

              return (
                <div key={item.id} className={"flex items-center gap-4 p-3 bg-neutral-50 rounded-[15px]"}>
                  <div className={"relative w-16 h-16 rounded-[12px] overflow-hidden bg-white shrink-0"}>
                    <Image
                      src={imgSrc}
                      alt={item.titleSnapshot}
                      fill
                      className={"object-cover"}
                      unoptimized
                    />
                  </div>
                  <div className={"flex-1 min-w-0"}>
                    <p className={"font-medium truncate"}>{item.titleSnapshot}</p>
                    <p className={"text-sm text-muted-foreground"}>SKU: {item.skuSnapshot}</p>
                  </div>
                  <div className={"text-right shrink-0"}>
                    <p className={"font-semibold"}>
                      ${(item.quantity * item.priceSnapshot).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <p className={"text-sm text-muted-foreground"}>
                      {item.quantity} × ${item.priceSnapshot.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              );
            })}
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className={"w-full max-w-6xl mx-auto p-6 space-y-6"}>
      <Button
        variant={"ghost"}
        className={"mb-4"}
        onClick={() => router.push('/orders')}
      >
        <ArrowLeft className={"w-4 h-4 mr-2"} />
        Back to Orders
      </Button>

      <div className={"bg-white rounded-[30px] p-8 shadow-md space-y-6"}>
        <div className={"flex items-start justify-between"}>
          <div className={"space-y-2"}>
            <h1 className={"text-3xl font-medium tracking-tight"}>
              Order #{order.id.slice(0, 8)}
            </h1>
            <p className={"text-muted-foreground"}>
              Created {format(new Date(order.createdAt), 'dd MMMM yyyy, HH:mm')}
            </p>
          </div>
          <Badge className={`${statusConfig.color} flex items-center gap-2 px-4 py-2 text-base`}>
            <StatusIcon className={"w-4 h-4"} />
            {statusConfig.label}
          </Badge>
        </div>

        <div className={"flex items-center gap-3"}>
          <Button
            variant={"default"}
            className={"rounded-full h-11 gap-2 px-6"}
            onClick={handleReorder}
          >
            <ICONS.RefreshLoading size={16} color={"currentColor"} />
            Reorder
          </Button>
          {renderActionButtons()}
        </div>

        <div className={"grid grid-cols-1 md:grid-cols-3 gap-6 pt-4"}>
          <Card className={"p-6 border-0 bg-neutral-50 rounded-[20px]"}>
            <p className={"text-sm text-muted-foreground mb-2"}>Total Amount</p>
            <p className={"text-2xl font-bold"}>${order.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </Card>
          <Card className={"p-6 border-0 bg-neutral-50 rounded-[20px]"}>
            <p className={"text-sm text-muted-foreground mb-2"}>Platform Fee (4%)</p>
            <p className={"text-2xl font-bold"}>${order.platformFee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
          </Card>
          <Card className={"p-6 border-0 bg-neutral-50 rounded-[20px]"}>
            <p className={"text-sm text-muted-foreground mb-2"}>Suppliers</p>
            <p className={"text-2xl font-bold"}>{order.subOrders.length}</p>
          </Card>
        </div>
      </div>

      <div className={"space-y-4"}>
        <h2 className={"text-2xl font-medium"}>Orders by Supplier</h2>
        {order.subOrders.map((subOrder, idx) => {
          const subStatusConfig = ORDER_STATUS_CONFIG[subOrder.status as keyof typeof ORDER_STATUS_CONFIG] || ORDER_STATUS_CONFIG.NEW;
          const SubStatusIcon = subStatusConfig.icon;
          const supplierName = subOrder.supplier?.profile?.companyName || subOrder.supplier?.name || `Supplier ${idx + 1}`;
          const totalSubOrderAmount = subOrder.items.reduce((sum, item) => sum + (item.quantity * item.priceSnapshot), 0);

          return (
            <Card key={subOrder.id} className={"bg-white rounded-[30px] p-6 border-0 shadow-md space-y-4"}>
              <div className={"flex items-start justify-between pb-4 border-b"}>
                <div className={"flex items-start gap-4"}>
                  <div className={"w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0"}>
                    <Building2 className={"w-6 h-6 text-secondary"} />
                  </div>
                  <div>
                    <h3 className={"text-lg font-semibold"}>{supplierName}</h3>
                    <p className={"text-sm text-muted-foreground"}>
                      Sub-order #{subOrder.id.slice(0, 8)}
                    </p>
                    <p className={"text-sm font-medium mt-1"}>
                      Total: ${totalSubOrderAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
                <div className={"flex items-center gap-3"}>
                  {!isSupplier && subOrder.status === 'SHIPPED' && (
                    <Button
                      size={"sm"}
                      className={"rounded-full h-8 gap-1 bg-green-600 hover:bg-green-700 text-xs"}
                      onClick={() => {
                        toast.promise(
                          new Promise((resolve, reject) => {
                            updateStatus(
                              { id: subOrder.id, status: 'DELIVERED' },
                              { onSuccess: resolve, onError: reject },
                            );
                          }),
                          {
                            loading: 'Marking as delivered...',
                            success: 'Sub-order marked as delivered!',
                            error: 'Failed to update status.',
                          },
                        );
                      }}
                    >
                      <CheckCircle2 className={"w-3 h-3"} />
                      Mark Delivered
                    </Button>
                  )}
                  <Badge className={`${subStatusConfig.color} flex items-center gap-1 px-3 py-1`}>
                    <SubStatusIcon className={"w-3 h-3"} />
                    {subStatusConfig.label}
                  </Badge>
                </div>
              </div>

              <div className={"space-y-3"}>
                <h4 className={"text-sm font-semibold text-muted-foreground uppercase tracking-wider"}>
                  Items ({subOrder.items.length})
                </h4>
                {subOrder.items.map(item => {
                  const imgSrc = item.product?.images?.[0]
                    ? item.product.images[0].startsWith('http')
                      ? item.product.images[0]
                      : ROUTES.S3(item.product.images[0])
                    : '/placeholder.png';

                  return (
                    <div key={item.id} className={"flex items-center gap-4 p-3 bg-neutral-50 rounded-[15px]"}>
                      <div className={"relative w-16 h-16 rounded-[12px] overflow-hidden bg-white shrink-0"}>
                        <Image
                          src={imgSrc}
                          alt={item.titleSnapshot}
                          fill
                          className={"object-cover"}
                          unoptimized
                        />
                      </div>
                      <div className={"flex-1 min-w-0"}>
                        <p className={"font-medium truncate"}>{item.titleSnapshot}</p>
                        <p className={"text-sm text-muted-foreground"}>SKU: {item.skuSnapshot}</p>
                      </div>
                      <div className={"text-right shrink-0"}>
                        <p className={"font-semibold"}>
                          ${(item.quantity * item.priceSnapshot).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        <p className={"text-sm text-muted-foreground"}>
                          {item.quantity} × ${item.priceSnapshot.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
