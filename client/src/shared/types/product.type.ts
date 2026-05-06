import { THoReCa } from './horeca.type';

export interface IProduct {
  id: string;
  name: string;
  manufacturer: string;
  minPieces: number;
  price: number;
  image: string;
  category: THoReCa;
  badge?: string;
  isFavorite?: boolean;
}