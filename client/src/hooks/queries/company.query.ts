import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { companyService, userService } from '@/services';

export const useGetCompany = (id: string) =>
  useQuery({
    queryKey: ['company', id],
    queryFn: () => companyService.getById(id),
    enabled: !!id,
  });

export const useGetMe = () =>
  useQuery({
    queryKey: ['user', 'me'],
    queryFn: () => userService.getMe(),
  });

export const useUpdateCompany = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: any) => companyService.updateMyCompany(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['company'] });
    },
  });
};
