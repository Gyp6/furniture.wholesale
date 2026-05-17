import { UserMapper } from '@identity/application/mappers';
import { IUserRepository } from '@identity/domain/contracts';
import { User } from '@identity/domain/entities';
import { Injectable } from '@nestjs/common';
import type { Prisma, User as PrismaUser } from '@prisma/client';

import { PrismaService } from '@/infrastructure/prisma/prisma.service';

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly include = {
    profile: { include: { company: true } },
  } as const;

  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string): Promise<User | null> {
    const raw = await this.prisma.user.findUnique({
      where: { id },
      include: this.include,
    });
    return raw ? UserMapper.toDomain(raw) : null;
  }

  async findRawById(id: string): Promise<PrismaUser | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    const raw = await this.prisma.user.findUnique({
      where: { email },
      include: this.include,
    });
    return raw ? UserMapper.toDomain(raw) : null;
  }

  async updateById(
    id: string,
    data: Prisma.UserUpdateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<User> {
    const client = tx ?? this.prisma;
    const raw = await client.user.update({
      where: { id },
      data,
      include: this.include,
    });
    return UserMapper.toDomain(raw);
  }

  async updateByEmail(
    email: string,
    data: Prisma.UserUpdateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<User> {
    const client = tx ?? this.prisma;
    const raw = await client.user.update({
      where: { email },
      data,
      include: this.include,
    });
    return UserMapper.toDomain(raw);
  }
}
