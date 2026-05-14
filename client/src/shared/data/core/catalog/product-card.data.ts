import { ROUTES } from '@/constants';
import { EHoReCaType } from '@/shared/enums';
import { IProduct } from '@/shared/types';

export const productCardData: Omit<IProduct, 'id'> = {
  title: 'Freedom Miro dining table',
  vendor: 'Noble Furniture Co.',
  minPieces: 8,
  price: 8900,
  image: ROUTES.S3('marketplace/table-1.png'),
  space: EHoReCaType.CAFE,
};
