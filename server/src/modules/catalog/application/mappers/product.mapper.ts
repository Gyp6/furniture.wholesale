import { ProductResponse } from '@catalog/application/dto/responses';
import { Product } from '@catalog/domain/entities';
import { Prisma } from '@prisma/client';

type PrismaProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    vendor: { select: { id: true; name: true } };
    tags: { include: { tag: true } };
  };
}>;

export class ProductMapper {
  static toDomain(raw: PrismaProductWithRelations): Product {
    return new Product(
      raw.id,
      raw.title,
      raw.images,
      Number(raw.price),
      raw.minSellQuantity,
      raw.categoryId,
      raw.vendorId,
      raw.vendor.name,
      raw.supplierId,
      raw.tags.map(t => ({ title: t.tag.title, slug: t.tag.slug })),
      raw.spaceType,
      raw.status,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  static toResponse(entity: Product): ProductResponse {
    return {
      id: entity.id,
      title: entity.title,
      images: entity.images,
      price: entity.price,
      minSellQuantity: entity.minSellQuantity,
      categoryId: entity.categoryId,
      vendor: entity.vendorName,
      tags: entity.tags,
      spaceType: entity.spaceType,
    };
  }
}
