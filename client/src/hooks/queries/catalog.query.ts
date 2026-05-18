import { useQuery } from '@tanstack/react-query';

import {
  categoryService,
  IProductParams,
  productService,
  productTagService,
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
