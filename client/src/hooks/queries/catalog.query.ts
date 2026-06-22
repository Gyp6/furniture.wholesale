import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useAuthStatus } from '@/hooks/use-auth-status.hook';
import {
  categoryService,
  IProductParams,
  productService,
  productTagService,
  spaceService,
} from '@/services';

export const useGetCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.getAll(),
  });

export const useGetTags = () =>
  useQuery({
    queryKey: ['tags'],
    queryFn: () => productTagService.getAll(),
  });

export const useGetSpaces = () =>
  useQuery({
    queryKey: ['spaces'],
    queryFn: () => spaceService.getAll(),
  });

export const useGetProducts = (params: IProductParams) =>
  useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getAll(params),
  });

export const useGetProduct = (id: string) =>
  useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getOne(id),
  });

export const useGetMyProducts = () => {
  const { user } = useAuthStatus();
  return useQuery({
    queryKey: ['products', 'my', user?.id],
    queryFn: () => productService.getMyProducts(),
    enabled: !!user?.id && (user.role === 'SUPPLIER' || user.role === 'ADMIN'),
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => productService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};

export const useUpdateProduct = (id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => productService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['product', id] });
    },
  });
};
