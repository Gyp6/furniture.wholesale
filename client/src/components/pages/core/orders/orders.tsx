'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Package, ChevronRight, Clock, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/shadcn/button';
import { Card } from '@/components/ui/shadcn/card';
import { Skeleton } from '@/components/ui/shadcn/skeleton';
import { Badge } from '@/components/ui/shadcn/badge';
import { useGetMyOrders } from '@/hooks/queries';

const ORDER_STATUS_CONFIG = {
  NEW: { label: 'New', color: 'bg-blue-100 text-blue-700', icon: Clock },
  CONFIRMED: { label: 'Confirmed', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  PROCESSING: { label: 'Processing', color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle },
  SHIPPED: { label: 'Shipped', color: 'bg-purple-100 text-purple-700', icon: Package },
  DELIVERED: { label: 'Delivered', color: 'bg-green-100 text-green-700', icon: CheckCircle2 },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-700', icon: XCircle },
};

export function OrdersPage() {
  const router = useRouter();
  const { data: orders, isLoading } = useGetMyOrders();

  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6 space-y-4">
        <Skeleton className="h-10 w-48" />
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-[30px]" />
        ))}
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <h1 className="text-4xl font-medium tracking-tight mb-8">My Orders</h1>
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-[30px]">
          <Package className="w-16 h-16 text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No orders yet</h3>
          <p className="text-muted-foreground mb-6">Browse the catalog and place your first order</p>
          <Button onClick={() => router.push('/catalog')}>
            Go to Catalog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-medium tracking-tight">My Orders</h1>
        <Badge variant="secondary" className="text-sm px-3 py-1">
          {orders.length} {orders.length === 1 ? 'order' : 'orders'}
        </Badge>
      </div>

      <div className="space-y-4">
        {orders.map(order => {
          const statusConfig = ORDER_STATUS_CONFIG[order.status as keyof typeof ORDER_STATUS_CONFIG] || ORDER_STATUS_CONFIG.NEW;
          const StatusIcon = statusConfig.icon;

          return (
            <Card
              key={order.id}
              className="bg-white p-6 rounded-[30px] border-0 shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => router.push(`/orders/${order.id}`)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge className={`${statusConfig.color} flex items-center gap-1 px-3 py-1`}>
                      <StatusIcon className="w-3 h-3" />
                      {statusConfig.label}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(order.createdAt), 'dd MMM yyyy, HH:mm')}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order</p>
                      <p className="font-mono text-sm">#{order.id.slice(0, 8)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="text-lg font-semibold">${order.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Platform Fee</p>
                      <p className="text-sm font-medium">${order.platformFee.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <p className="text-sm text-muted-foreground">
                      Split into {order.subOrders.length} {order.subOrders.length === 1 ? 'supplier' : 'suppliers'}
                    </p>
                    <div className="flex gap-1">
                      {order.subOrders.slice(0, 3).map((sub, idx) => (
                        <Badge key={sub.id} variant="outline" className="text-xs">
                          {sub.supplier?.profile?.companyName || sub.supplier?.name || `Supplier ${idx + 1}`}
                        </Badge>
                      ))}
                      {order.subOrders.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{order.subOrders.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <Button variant="ghost" size="icon" className="shrink-0">
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
