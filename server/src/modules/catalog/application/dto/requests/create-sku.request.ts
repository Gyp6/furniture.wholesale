import { ISkuDataInput } from '@/common/types';

export class CreateSkuRequest implements ISkuDataInput {
  name!: string;
  price!: number;
  sequence!: number;
  manufacturerCode!: string;
}
