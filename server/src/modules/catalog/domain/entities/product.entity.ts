import { TProductStatusValues, TRoleValues } from '@/common/types';

export interface IInfoObject {
  id: string;
  title: string;
  slug: string;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: TRoleValues;
  banned: boolean | null;
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
    public readonly price: number,
    public readonly stock: number,
    public readonly minSellUnits: number | null,
    public readonly imagesCount: number,
    public readonly leadTime: string | null,
    public readonly status: TProductStatusValues,
    public readonly categoryId: string,
    public readonly supplierId: string,
    public readonly manufacturerId: string,
    public readonly dimensionId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,

    public readonly category: IInfoObject,
    public readonly supplier: IUser,
    public readonly manufacturer: IProductManufacturer,
    public readonly dimension: IProductDimension,
    public readonly spaces: IInfoObject[],
    public readonly tags: IInfoObject[],
  ) {}
}
