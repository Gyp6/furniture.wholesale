import { Injectable } from '@nestjs/common';
import type { Prisma, User } from '@prisma/client';

import { PrismaService } from '@/infrastructure/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: { id },
      include: {
        profile: {
          include: {
            company: true,
          },
        },
      },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: { email },
      include: {
        profile: {
          include: {
            company: true,
          },
        },
      },
    });
  }

  async updateById(
    id: string,
    data: Prisma.UserUpdateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prismaService;
    return client.user.update({
      where: { id },
      data,
      include: {
        profile: {
          include: {
            company: true,
          },
        },
      },
    });
  }

  async updateByEmail(
    email: string,
    data: Prisma.UserUpdateInput,
    tx?: Prisma.TransactionClient,
  ) {
    const client = tx ?? this.prismaService;
    return client.user.update({
      where: { email },
      data,
      include: {
        profile: {
          include: {
            company: true,
          },
        },
      },
    });
  }
}
