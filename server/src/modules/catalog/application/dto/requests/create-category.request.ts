import { IsName } from '@/common/validators';

export class CreateCategoryRequest {
  @IsName()
  name!: string;
}
