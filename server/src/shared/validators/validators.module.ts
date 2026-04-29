import { Global, Module } from '@nestjs/common';

import { PrismaService } from '@/infrastructure/prisma/prisma.service';

import { IsUniqueConstraint } from './is-unique.validator';

@Global()
@Module({
  providers: [IsUniqueConstraint, PrismaService],
  exports: [IsUniqueConstraint],
})
export class ValidatorsModule {}
