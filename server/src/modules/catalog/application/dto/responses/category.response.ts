import { IsHash, IsName } from '@/common/validators';

export class CategoryResponse {
  @IsHash({ title: 'Id' })
  id!: string;

  @IsName()
  name!: string;
}
