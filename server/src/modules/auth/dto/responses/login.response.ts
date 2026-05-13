import { ApiProperty } from '@nestjs/swagger';

import { BA_UserResponse } from '@/common/dto/responses';

export class LoginResponse {
  @ApiProperty({
    example: false,
  })
  redirect!: boolean;

  @ApiProperty({
    example: 'n4JGynlh1xgvTxfCG8PNCFhdqi84Z0mL',
  })
  token!: string;

  @ApiProperty({
    type: () => BA_UserResponse,
  })
  user!: BA_UserResponse;
}
