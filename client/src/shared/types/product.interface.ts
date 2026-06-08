import { IFilter } from './category.interface';

export interface IManufacturer {
  id: string;
  name: string;
  specializations: string[];
  isVerified: boolean;
  ratingAvg: number;
}

export interface IDimension {
  width: number;
  height: number;
  depth: number;
}

export interface IProduct {
  id: string;
  sku: string;
  title: string;
  description: string | null;
  price: number;
  stock: number;
  images: string[];
  minSellUnits: number | null;
  dimension: IDimension;
  manufacturer: IManufacturer;
  category: IFilter;
  spaces: IFilter[];
  tags: IFilter[];
  leadTime: string | null;
  createdAt: string;
  status?: string;
}
