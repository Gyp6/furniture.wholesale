import { ApiProperty } from '@nestjs/swagger';

import { MESSAGE, STATUS } from '@/common/constants';
import type { TMessageValues, TStatusValues } from '@/common/types';

export class HelloResponse {
  @ApiProperty({
    example: MESSAGE.GREATINGS,
    enum: MESSAGE,
  })
  message!: TMessageValues;

  @ApiProperty({
    example: STATUS.OK,
    enum: STATUS,
  })
  status!: TStatusValues;
}
