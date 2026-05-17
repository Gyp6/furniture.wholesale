import { ApiProperty } from '@nestjs/swagger';

export class UploadUrlResponse {
  @ApiProperty({ example: 'https://s3.../presigned-url' })
  uploadUrl!: string;

  @ApiProperty({ example: 'http://localhost:4566/bucket/products/abc123' })
  publicUrl!: string;

  @ApiProperty({ example: 'products/abc123' })
  key!: string;
}
