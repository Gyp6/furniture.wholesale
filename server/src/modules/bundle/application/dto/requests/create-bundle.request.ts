import type { TBundleTypeValues } from '@/common/types';
import {
  IsBundleType,
  IsDescription,
  IsHash,
  IsTitle,
} from '@/common/validators';

export class CreateBundleRequest {
  @IsTitle()
  name!: string;

  @IsDescription()
  description?: string;

  @IsBundleType()
  bundleType!: TBundleTypeValues;

  @IsHash({ title: 'spaceTypeId' })
  spaceTypeId!: string;
}
