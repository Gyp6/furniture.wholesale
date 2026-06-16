import { IsHash, IsSlug, IsTitle } from '@/common/validators';

export class SpaceResponse {
  @IsHash({ title: 'Id' })
  id!: string;

  @IsTitle()
  title!: string;

  @IsSlug()
  slug!: string;
}
