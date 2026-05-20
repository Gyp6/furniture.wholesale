import { TProductStatusValues, TSpaceTypeValues } from '@/common/types';

export interface IProductTag {
  id: string;
  title: string;
  slug: string;
}

export interface IProductDimension {
  id: string;
  width: number;
  height: number;
  depth: number;
}

export interface IProductManufacturer {
  id: string;
  name: string;
  specializations: string[];
  verificationStatus: string;
  ratingAvg: number;
}

export class Product {
  constructor(
    public readonly id: string,
    public readonly sku: string,
    public readonly title: string,
    public readonly description: string | null,
    public readonly images: string[],
    public readonly price: number,
    public readonly stock: number,
    public readonly minSellUnits: number | null,
    public readonly status: TProductStatusValues,
    public readonly spaceType: TSpaceTypeValues,
    public readonly categoryId: string,
    public readonly supplierId: string,
    public readonly manufacturerId: string,
    public readonly dimensionId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,

    public readonly dimension: IProductDimension,
    public readonly manufacturer: IProductManufacturer,
    public readonly tags: IProductTag[],
  ) {}
}
