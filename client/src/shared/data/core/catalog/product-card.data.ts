import { ROUTES } from '@/constants';
import { IBundle, IProduct } from '@/shared/types';

// Mock data updated to match new interface structure for cases where live data is missing
export const productCardData: Omit<IProduct, 'id'> = {
  sku: 'MOCK-SKU-001',
  title: 'Freedom Miro dining table',
  description: 'Mock description',
  price: 8900,
  stock: 100,
  images: [ROUTES.S3('marketplace/table-1.png')],
  minSellUnits: 8,
  dimension: { width: 1200, height: 750, depth: 800 },
  manufacturer: {
    id: 'm-1',
    name: 'Noble Furniture Co.',
    specializations: ['Dining'],
    isVerified: true,
    ratingAvg: 4.8,
  },
  category: { id: 'c-1', title: 'Dining', slug: 'dining' },
  spaces: [{ id: 's-1', title: 'Cafe', slug: 'cafe' }],
  tags: [{ id: 't-1', title: 'Modern', slug: 'modern' }],
  leadTime: '4-6 weeks',
  createdAt: new Date().toISOString(),
};

export const bundleCardData: Omit<IBundle, 'id'> = {
  bundleType: 'SUPPLIER',
  depth: 0,
  userId: 'u-1',
  name: 'Modern Executive Suite',
  description:
    'A precision-engineered workspace solution combining Scandinavian minimalism with ergonomic excellence.',
  status: 'ACTIVE',
  isShared: true,
  shareToken: 'token-1',
  shareUrl: null,
  space: { id: 's-1', title: 'Office', slug: 'office' },
  parentBundleId: null,
  items: [],
  totalPrice: 13900,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
