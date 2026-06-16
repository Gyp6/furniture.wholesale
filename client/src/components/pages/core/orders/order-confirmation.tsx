'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { CheckCircle2, Building2, ShoppingBag, ArrowRight } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/shadcn/button';
import { Card } from '@/components/ui/shadcn/card';
import { Skeleton } from '@/components/ui/shadcn/skeleton';
import { useGetOrder } from '@/hooks/queries';
import { ROUTES } from '@/constants';

interface Props {
  params: Promise<{ id: string }>;
}

export function OrderConfirmationPage({ params }: Props) {
  const { id } = use(params);
  const router = useRouter();
  const { data: order, isLoading, isError } = useGetOrder(id);

  if (isLoading) {
    return (
      <div className={"w-full max-w-4xl mx-auto p-6 space-y-6"}>
        <Skeleton className={"h-40 w-full rounded-[30px]"} />
        <Skeleton className={"h-64 w-full rounded-[30px]"} />
      </div>
    );
  }

  if (isError || !order) {
    return (
      <div className={"w-full max-w-4xl mx-auto p-6"}>
        <div className={"flex flex-col items-center justify-center p-16 bg-white rounded-[30px]"}>
          <h3 className={"text-xl font-medium mb-2"}>Order not found</h3>
          <p className={"text-muted-foreground mb-6"}>Please check the link</p>
          <Button onClick={() => router.push('/dashboard')}>
            Go to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={"w-full max-w-4xl mx-auto p-6 space-y-6"}>
      <Card className={"p-8 rounded-[30px] border-0 shadow-md text-center space-y-4"}>
        <div className={"flex justify-center"}>
          <div className={"w-16 h-16 rounded-full bg-green-100 flex items-center justify-center"}>
            <CheckCircle2 className={"w-8 h-8 text-green-600"} />
          </div>
        </div>
        <h1 className={"text-3xl font-medium tracking-tight"}>Order Placed Successfully!</h1>
        <p className={"text-muted-foreground max-w-md mx-auto"}>
          Your order has been confirmed. Each supplier has been notified and a confirmation email has been sent to you.
        </p>

        <div className={"grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4"}>
          <div className={"bg-neutral-50 rounded-[20px] p-4"}>
            <p className={"text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1"}>
              Order Number
            </p>
            <p className={"text-lg font-bold"}>#{order.id.slice(0, 8).toUpperCase()}</p>
          </div>
          <div className={"bg-neutral-50 rounded-[20px] p-4"}>
            <p className={"text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1"}>
              Date
            </p>
            <p className={"text-lg font-bold"}>
              {format(new Date(order.createdAt), 'dd MMM yyyy')}
            </p>
          </div>
          <div className={"bg-neutral-50 rounded-[20px] p-4"}>
            <p className={"text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-1"}>
              Total Amount
            </p>
            <p className={"text-lg font-bold"}>
              ${order.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </Card>

      <div className={"space-y-4"}>
        <h2 className={"text-2xl font-medium"}>Order Details by Supplier</h2>
        {order.subOrders.map((subOrder, idx) => {
          const supplierName =
            subOrder.supplier?.profile?.company?.name
            || subOrder.supplier?.name
            || `Supplier ${idx + 1}`;
          const totalSubOrderAmount = subOrder.items.reduce(
            (sum, item) => sum + item.quantity * item.priceSnapshot,
            0,
          );

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
                      Total: ${totalSubOrderAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                </div>
              </div>

              <div className={"space-y-3"}>
                {subOrder.items.map(item => {
                  const imgSrc = item.product?.images?.[0]
                    ? item.product.images[0].startsWith('http')
                      ? item.product.images[0]
                      : ROUTES.S3(item.product.images[0])
                    : '/placeholder.png';

                  return (
                    <div key={item.id} className={"flex items-center gap-4 p-3 bg-neutral-50 rounded-[15px]"}>
                      <div className={"relative w-14 h-14 rounded-[10px] overflow-hidden bg-white shrink-0"}>
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
                          ${(item.quantity * item.priceSnapshot).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                        </p>
                        <p className={"text-sm text-muted-foreground"}>
                          {item.quantity} x ${item.priceSnapshot.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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

      <Card className={"p-6 rounded-[30px] border-0 shadow-md"}>
        <div className={"flex items-center justify-between"}>
          <div>
            <p className={"text-sm text-muted-foreground"}>Platform Fee (4%)</p>
            <p className={"text-lg font-semibold"}>
              ${order.platformFee.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div className={"text-right"}>
            <p className={"text-sm text-muted-foreground"}>Grand Total</p>
            <p className={"text-2xl font-bold"}>
              ${order.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </Card>

      <div className={"flex items-center justify-center gap-4 pt-4"}>
        <Button
          variant={"outline"}
          className={"rounded-full px-6 h-11 gap-2"}
          onClick={() => router.push('/')}
        >
          <ShoppingBag className={"w-4 h-4"} />
          Continue Shopping
        </Button>
        <Button
          className={"rounded-full px-6 h-11 gap-2"}
          onClick={() => router.push('/orders')}
        >
          Go to My Orders
          <ArrowRight className={"w-4 h-4"} />
        </Button>
      </div>
    </div>
  );
}
