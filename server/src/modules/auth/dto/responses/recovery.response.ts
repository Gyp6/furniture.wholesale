import { ApiProperty } from '@nestjs/swagger';

import { IsBool } from '@/shared/validators';

export class ForgetPasswordResponse {
  @IsBool({ title: 'Status' })
  status!: boolean;

  @ApiProperty({
    example:
      'If this email exists in our system, check your email for the reset link',
  })
  message!: string;
}

export class ResetPasswordResponse {
  @IsBool({ title: 'Status' })
  status!: boolean;
}
