import { ROUTES } from '@/constants';
import { EHoReCaType } from '@/shared/enums';
import { IBundle, IProduct } from '@/shared/types';

export const productCardData: Omit<IProduct, 'id'> = {
  title: 'Freedom Miro dining table',
  vendor: 'Noble Furniture Co.',
  minSellQuantity: 8,
  price: 8900,
  images: [ROUTES.S3('marketplace/table-1.png')],
  spaceType: EHoReCaType.CAFE,
  categoryId: 'abc123',
  tags: [
    { title: 'uhi', slug: 'uhi' },
    { title: 'ggg', slug: 'ggg' },
  ],
};

export const bundleCardData: Omit<IBundle, 'id'> = {
  title: 'Freedom Miro dining table',
  vendor: 'Noble Furniture Co.',
  description:
    'A precision-engineered workspace solution combining Scandinavian minimalism with ergonomic excellence.',
  itemsCount: 8,
  price: 8900,
  images: [ROUTES.S3('marketplace/table-1.png')],
};
