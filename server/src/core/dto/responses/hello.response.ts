import { ApiProperty } from '@nestjs/swagger';

export class HelloResponse {
  @ApiProperty({
    example: 'Welcome to @Gyp6.sale - Furniture.Wholesale API',
  })
  message!: string;
}
