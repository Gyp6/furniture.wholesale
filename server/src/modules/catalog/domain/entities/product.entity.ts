import { TProductStatusValues, TSpaceTypeValues } from '@/common/types';

export interface IProductTag {
  title: string;
  slug: string;
}

export class Product {
  constructor(
    public readonly id: string,
    public readonly title: string,
    public readonly images: string[],
    public readonly price: number,
    public readonly minSellQuantity: number | null,
    public readonly categoryId: string,
    public readonly vendorId: string,
    public readonly vendorName: string,
    public readonly supplierId: string,
    public readonly tags: IProductTag[],
    public readonly spaceType: TSpaceTypeValues,
    public readonly status: TProductStatusValues,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
  ) {}
}
