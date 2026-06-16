import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  AddBundleItemRequest,
  bundleService,
  CreateBundleRequest,
} from '@/services';
import { useAuthStatus } from '@/hooks/use-auth-status.hook';

export const useGetMyBundles = (type?: 'USER' | 'SUPPLIER') => {
  const { user } = useAuthStatus();
  return useQuery({
    queryKey: ['bundles', 'my', type, user?.id],
    queryFn: () => bundleService.getMyBundles(type),
    enabled: !!user?.id,
  });
};

export const useGetSupplierBundles = (params?: {
  supplierId?: string;
  companyId?: string;
}) =>
  useQuery({
    queryKey: ['bundles', 'supplier', params],
    queryFn: () => bundleService.getSupplierBundles(params),
  });

export const useGetBundle = (id: string) =>
  useQuery({
    queryKey: ['bundle', id],
    queryFn: () => bundleService.getOne(id),
    enabled: !!id,
  });

export const useGetSharedBundle = (token: string) =>
  useQuery({
    queryKey: ['bundle', 'shared', token],
    queryFn: () => bundleService.getByShareToken(token),
    enabled: !!token,
  });

export const useCreateBundle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateBundleRequest) => bundleService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
    },
  });
};

export const useAddBundleItem = (bundleId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (item: AddBundleItemRequest) =>
      bundleService.addItem(bundleId, item),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundle', bundleId] });
      queryClient.invalidateQueries({ queryKey: ['bundle', 'shared'] });
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
    },
  });
};

export const useForkBundle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bundleId: string) => bundleService.fork(bundleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
    },
  });
};

export const useRemoveBundleItem = (bundleId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId: string) => bundleService.removeItem(bundleId, itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundle', bundleId] });
      queryClient.invalidateQueries({ queryKey: ['bundle', 'shared'] });
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
    },
  });
};

export const useUpdateBundle = (bundleId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: Partial<CreateBundleRequest>) => bundleService.update(bundleId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundle', bundleId] });
      queryClient.invalidateQueries({ queryKey: ['bundle', 'shared'] });
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
    },
  });
};

export const useShareBundle = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bundleId: string) => bundleService.share(bundleId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bundles'] });
    },
  });
};
