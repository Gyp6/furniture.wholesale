import { ROUTES } from '@/constants';

export const ProductCardData = {
  name: 'Freedom Miro dining table',
  vendor: 'Noble Furniture Co.',
  category: 'Cafe',
  minPieces: 8,
  price: 8900,
  image: ROUTES.S3('marketplace/table-1.png'),
};
export const BundleCardData = {
  name: 'Modern Executive Suite',
  vendor: 'Noble Furniture Co.',
  description: 'A precision-engineered workspace solution combining Scandinavian minimalism with ergonomic excellence.',
  price: 13900,
  itemsCount: 12,
  images: [
    ROUTES.S3('marketplace/chair.png'),
    ROUTES.S3('marketplace/desk.png'),
    ROUTES.S3('marketplace/lamp.png'),
    ROUTES.S3('marketplace/shelf.png'),
  ],
};
export const OrderCardData = {
  name: 'Freedom Miro dining table',
  vendor: 'Noble Furniture Co.',
  category: 'Cafe',
  minPieces: 8,
  pricePerUnit: 1260,
  quantity: 8,
  image: ROUTES.S3('marketplace/table-1.png'),
};
export const ProductData = {
  name: 'Nordic Arc Dining Chair v.04',
  pricePerUnit: 342.00,
  description: 'Designed for high-traffic boutique hospitality environments. The Nordic Arc combines structural Scandinavian oak with a reinforced internal steel frame, ensuring longevity without sacrificing its featherlight aesthetic. Upholstered in Grade A flame-retardant textile.',
  quantity: 8,
  image: ROUTES.S3('marketplace/chair-1.png'),
  gallery: [
    ROUTES.S3('marketplace/chair-1.png'),
    ROUTES.S3('marketplace/chair-1.png'),
    ROUTES.S3('marketplace/chair-1.png'),
    ROUTES.S3('marketplace/chair-1.png'),
  ],
  totalGalleryCount: 12,
  specs: {
    skuReference: 'NAC-D-4022-OK',
    minimumOrder: 12,
    dimensions: '900 x 780H mm',
    leadTime: '6-8 Weeks',
  },
  supplier: {
    name: 'Stellar Manufactory',
    specialization: 'Boutique Hotels & Modern Workspaces',
    rating: 4.9,
    verified: true,
    image: ROUTES.S3('marketplace/chair-1.png'),
  },
};