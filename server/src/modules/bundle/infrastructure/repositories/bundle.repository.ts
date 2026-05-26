import { UpdateBundleRequest } from '@bundle/application/dto/requests';
import { BundleMapper } from '@bundle/application/mappers';
import { IBundleRepository } from '@bundle/domain/contracts';
import { Bundle, BundleItem } from '@bundle/domain/entities';
import { Injectable } from '@nestjs/common';
import { Prisma, Bundle as PrismaBundle, ProductStatus } from '@prisma/client';

import { PrismaService } from '@/infrastructure/prisma/prisma.service';

@Injectable()
export class BundleRepository implements IBundleRepository {
  private readonly include = {
    items: true,
  } as const satisfies Prisma.BundleInclude;

  constructor(private readonly prisma: PrismaService) {}

  async findAllByUserId(userId: string): Promise<Bundle[]> {
    const raws = await this.prisma.bundle.findMany({
      where: { userId },
      include: this.include,
      orderBy: { createdAt: 'desc' },
    });
    return raws.map(r => BundleMapper.toDomain(r));
  }

  async findById(id: string): Promise<Bundle | null> {
    const raw = await this.prisma.bundle.findUnique({
      where: { id },
      include: this.include,
    });
    return raw ? BundleMapper.toDomain(raw) : null;
  }

  async findByShareToken(token: string): Promise<Bundle | null> {
    const raw = await this.prisma.bundle.findUnique({
      where: { shareToken: token },
      include: this.include,
    });
    return raw ? BundleMapper.toDomain(raw) : null;
  }

  async findRaw(id: string): Promise<PrismaBundle | null> {
    return await this.prisma.bundle.findUnique({
      where: { id },
    });
  }

  async create(bundle: Bundle): Promise<Bundle> {
    const raw = await this.prisma.bundle.create({
      data: {
        id: bundle.id,
        bundleType: bundle.bundleType,
        depth: bundle.depth,
        userId: bundle.userId,
        spaceTypeId: bundle.spaceTypeId,
        parentBundleId: bundle.parentBundleId,
        name: bundle.name,
        description: bundle.description,
        status: bundle.status,
        isShared: bundle.isShared,
        shareToken: bundle.shareToken,
        items: {
          create: bundle.items.map(item => ({
            id: item.id,
            productId: item.productId,
            nestedBundleId: item.nestedBundleId,
            quantity: item.quantity,
            priceSnapshot: item.priceSnapshot,
          })),
        },
      },
      include: this.include,
    });

    return BundleMapper.toDomain(raw);
  }

  async update(
    id: string,
    dto: UpdateBundleRequest | { isShared: boolean; shareToken: string | null },
  ): Promise<Bundle> {
    const raw = await this.prisma.bundle.update({
      where: { id },
      data: dto,
      include: this.include,
    });
    return BundleMapper.toDomain(raw);
  }

  async updateStatus(id: string, status: ProductStatus): Promise<Bundle> {
    const raw = await this.prisma.bundle.update({
      where: { id },
      data: { status },
      include: this.include,
    });
    return BundleMapper.toDomain(raw);
  }

  async delete(id: string): Promise<void> {
    await this.prisma.bundle.delete({ where: { id } });
  }

  async addItem(bundleId: string, item: BundleItem): Promise<Bundle> {
    const raw = await this.prisma.bundle.update({
      where: { id: bundleId },
      data: {
        items: {
          create: {
            id: item.id,
            productId: item.productId,
            nestedBundleId: item.nestedBundleId,
            quantity: item.quantity,
            priceSnapshot: item.priceSnapshot,
          },
        },
      },
      include: this.include,
    });
    return BundleMapper.toDomain(raw);
  }

  async removeItem(bundleItemId: string): Promise<void> {
    await this.prisma.bundleItem.delete({ where: { id: bundleItemId } });
  }
}
