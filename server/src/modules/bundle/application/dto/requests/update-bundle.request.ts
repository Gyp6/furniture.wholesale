import { IsOptional } from 'class-validator';

import type { TProductStatusValues } from '@/common/types';
import { IsDescription, IsProductStatus, IsTitle } from '@/common/validators';

export class UpdateBundleRequest {
  @IsTitle()
  @IsOptional()
  name?: string;

  @IsDescription()
  @IsOptional()
  description?: string;

  @IsProductStatus()
  @IsOptional()
  status?: TProductStatusValues;
}
