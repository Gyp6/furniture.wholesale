import { ApiProperty } from '@nestjs/swagger';

import { IsHash, IsName } from '@/common/validators';

export class CategoryResponse {
  @IsHash({ title: 'Id' })
  id!: string;

  @IsName()
  title!: string;

  @ApiProperty({ example: 'nordic' })
  slug!: string;
}
