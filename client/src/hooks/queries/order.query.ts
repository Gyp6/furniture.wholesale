import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { CreateOrderRequest, orderService } from '@/services/order.service';
import { useAuthStatus } from '@/hooks/use-auth-status.hook';

export const useGetMyOrders = () => {
  const { user } = useAuthStatus();
  return useQuery({
    queryKey: ['orders', 'my', user?.id],
    queryFn: () => orderService.getMyOrders(),
    enabled: !!user?.id,
  });
};

export const useGetReceivedOrders = () => {
  const { user } = useAuthStatus();
  return useQuery({
    queryKey: ['orders', 'received', user?.id],
    queryFn: () => orderService.getReceivedOrders(),
    enabled: !!user?.id && (user.role === 'SUPPLIER' || user.role === 'ADMIN'),
  });
};

export const useGetOrder = (id: string) =>
  useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getOne(id),
    enabled: !!id,
  });

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateOrderRequest) => orderService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      orderService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order'] });
    },
  });
};
