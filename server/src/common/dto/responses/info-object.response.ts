import { IsHash, IsSlug, IsTitle } from '@/common/validators';

export class ClearInfoOnjectResponse {
  @IsTitle()
  title!: string;

  @IsSlug()
  slug!: string;
}

export class InfoObjectResponse extends ClearInfoOnjectResponse {
  @IsHash({ title: 'Id' })
  id!: string;
}
