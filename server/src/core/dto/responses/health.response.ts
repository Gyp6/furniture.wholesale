import { ApiProperty } from '@nestjs/swagger';

import { STATUS } from '@/common/constants';
import type { TStatusValues } from '@/common/types';

export class AuthHealthResponse {
  @ApiProperty({
    example: true,
  })
  ok!: boolean;
}

export class HealthResponse {
  @ApiProperty({
    example: STATUS.OK,
    enum: STATUS,
  })
  status!: TStatusValues;

  @ApiProperty({
    example: 567,
  })
  uptime!: number;

  @ApiProperty({
    example: '2026-03-21T21:30:00.000Z',
  })
  timestamp!: string;
}

export class HealthDbResponse extends HealthResponse {
  @ApiProperty({
    example: 'connected',
    enum: ['connected', 'disconnected'],
  })
  database!: string;

  @ApiProperty({
    required: false,
  })
  error?: unknown;
}
