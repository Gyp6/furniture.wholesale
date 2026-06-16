import { DimensionRequest } from '@/common/dto/requests';
import { IsHash } from '@/common/validators';

export class DimensionResponse extends DimensionRequest {
  @IsHash({ title: 'Id' })
  id!: string;
}
