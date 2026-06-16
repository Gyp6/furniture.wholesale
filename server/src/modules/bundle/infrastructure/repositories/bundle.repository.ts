import { UpdateBundleRequest } from '@bundle/application/dto/requests';
import { BundleMapper } from '@bundle/application/mappers';
import { IBundleRepository } from '@bundle/domain/contracts';
import { Bundle, BundleItem } from '@bundle/domain/entities';
import { Injectable } from '@nestjs/common';
import {
  BundleType,
  Prisma,
  Bundle as PrismaBundle,
  ProductStatus,
} from '@prisma/client';

import { BUNDLE_TYPES, PRODUCT_STATUSES } from '@/common/constants';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';

@Injectable()
export class BundleRepository implements IBundleRepository {
  private readonly include = {
    spaceType: true,
    items: {
      include: {
        product: {
          include: {
            manufacturer: true,
            supplier: true,
            category: true,
            dimension: true,
            spaces: { include: { spaceType: true } },
            tags: { include: { tag: true } },
          },
        },
        nestedBundle: {
          include: {
            spaceType: true,
            items: {
              include: {
                product: {
                  include: {
                    manufacturer: true,
                    supplier: true,
                    category: true,
                    dimension: true,
                    spaces: { include: { spaceType: true } },
                    tags: { include: { tag: true } },
                  },
                },
              },
            },
          },
        },
      },
    },
  } as const satisfies Prisma.BundleInclude;

  constructor(private readonly prisma: PrismaService) {}

  async findAllByUserId(userId: string, type?: BundleType): Promise<Bundle[]> {
    const raws = await this.prisma.bundle.findMany({
      where: {
        userId,
        ...(type ? { bundleType: type } : {}),
      },
      include: this.include,
      orderBy: { createdAt: 'desc' },
    });
    return raws.map(r => BundleMapper.toDomain(r));
  }

  async findAllSuppliers(params?: {
    userId?: string;
    companyId?: string;
  }): Promise<Bundle[]> {
    const raws = await this.prisma.bundle.findMany({
      where: {
        bundleType: BUNDLE_TYPES.SUPPLIER,
        status: PRODUCT_STATUSES.ACTIVE,
        ...(params?.userId ? { userId: params.userId } : {}),
        ...(params?.companyId
          ? { user: { profile: { companyId: params.companyId } } }
          : {}),
      },
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
    await this.prisma.bundle.create({
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
    });

    const updated = await this.findById(bundle.id);
    if (!updated) {
      throw new Error(`Bundle ${bundle.id} not found after creation`);
    }
    return updated;
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
    await this.prisma.bundleItem.create({
      data: {
        id: item.id,
        bundleId: bundleId,
        productId: item.productId,
        nestedBundleId: item.nestedBundleId,
        quantity: item.quantity,
        priceSnapshot: item.priceSnapshot,
      },
    });
    const updated = await this.findById(bundleId);
    if (!updated) {
      throw new Error(`Bundle ${bundleId} not found after adding item`);
    }
    return updated;
  }

  async removeItem(bundleItemId: string): Promise<void> {
    await this.prisma.bundleItem.delete({ where: { id: bundleItemId } });
  }
}
