import { Global, Module } from '@nestjs/common';

import { IsUniqueConstraint } from '@/shared/validators/is-unique.validator';

import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService, IsUniqueConstraint],
  exports: [PrismaService],
})
export class PrismaModule {}
