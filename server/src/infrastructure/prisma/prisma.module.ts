import { Global, Module } from '@nestjs/common';

import { IsUniqueConstraint } from '@/common/validators';

import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService, IsUniqueConstraint],
  exports: [PrismaService],
})
export class PrismaModule {}
