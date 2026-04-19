import { ApiProperty } from '@nestjs/swagger';

export class HealthResponse {
  @ApiProperty({
    example: 'ok',
  })
  status!: string;

  @ApiProperty({
    example: '2026-03-21T21:30:00.000Z',
  })
  timestamp!: string;
}
