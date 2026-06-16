import { ProfileMapper } from '@identity/application/mappers';
import { IProfileRepository } from '@identity/domain/contracts';
import { Profile } from '@identity/domain/entities';
import { Injectable } from '@nestjs/common';
import type { Prisma } from '@prisma/client';

import { PrismaService } from '@/infrastructure/prisma/prisma.service';

@Injectable()
export class ProfileRepository implements IProfileRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUserId(userId: string): Promise<Profile | null> {
    const raw = await this.prisma.profile.findUnique({
      where: { userId },
      include: { company: true },
    });
    return raw ? ProfileMapper.toDomain(raw) : null;
  }

  async create(
    data: Prisma.ProfileCreateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Profile> {
    const client = tx ?? this.prisma;
    const raw = await client.profile.create({
      data,
      include: { company: true },
    });
    return ProfileMapper.toDomain(raw);
  }

  async updateByUserId(
    userId: string,
    data: Prisma.ProfileUpdateInput,
    tx?: Prisma.TransactionClient,
  ): Promise<Profile> {
    const client = tx ?? this.prisma;
    const raw = await client.profile.update({
      where: { userId },
      data,
      include: { company: true },
    });
    return ProfileMapper.toDomain(raw);
  }
}
