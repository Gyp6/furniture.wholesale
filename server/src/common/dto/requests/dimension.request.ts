import { IsSize } from '@/common/validators';

export class DimensionRequest {
  @IsSize({ title: 'Width' })
  width!: number;

  @IsSize({ title: 'Height' })
  height!: number;

  @IsSize({ title: 'Depth' })
  depth!: number;
}
