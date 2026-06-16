import { IsHash, IsName, IsSlug } from '@/common/validators';

export class CategoryResponse {
  @IsHash({ title: 'Id' })
  id!: string;

  @IsName()
  title!: string;

  @IsSlug()
  slug!: string;
}
