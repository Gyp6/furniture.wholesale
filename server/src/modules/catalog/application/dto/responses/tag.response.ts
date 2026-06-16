import { IsHash, IsSlug, IsTitle } from '@/common/validators';

export class TagResponse {
  @IsHash({ title: 'Id' })
  id!: string;

  @IsTitle()
  title!: string;

  @IsSlug()
  slug!: string;
}
