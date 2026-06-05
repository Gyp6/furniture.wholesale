import { ROUTES } from '@/constants';
import { ECategory, ESpaceType } from '@/shared/enums';
import { IProduct } from '@/shared/types';

export const ProductCardData = {
  name: 'Freedom Miro dining table',
  vendor: 'Noble Furniture Co.',
  category: 'Cafe',
  minPieces: 8,
  price: 8900,
  image: ROUTES.S3('marketplace/table-1.png'),
};
export const BundleCardData = {
  id: 'bundle-1',
  title: 'Modern Executive Suite',
  name: 'Modern Executive Suite',
  vendor: 'Noble Furniture Co.',
  description:
    'A precision-engineered workspace solution combining Scandinavian minimalism with ergonomic excellence.',
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
  pricePerUnit: 342.0,
  description:
    'Designed for high-traffic boutique hospitality environments. The Nordic Arc combines structural Scandinavian oak with a reinforced internal steel frame, ensuring longevity without sacrificing its featherlight aesthetic. Upholstered in Grade A flame-retardant textile.',
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

export const MOCK_CATEGORIES = Object.values(ECategory).map((cat, index) => ({
  id: `cat-${index + 1}`,
  title: cat,
  slug: cat.toLowerCase().replace(/\s+/g, '-'),
}));

export const MOCK_TAGS = [
  { id: 'tag-1', title: 'Nordic', slug: 'nordic' },
  { id: 'tag-2', title: 'Industrial', slug: 'industrial' },
  { id: 'tag-3', title: 'Minimalist', slug: 'minimalist' },
  { id: 'tag-4', title: 'Modern', slug: 'modern' },
];

export const StyleOptions = [
  'Nordic',
  'Industrial',
  'Minimalist',
  'Modern',
  'Classic',
];

export const SpaceTypeOptions = [
  'Cafe',
  'Restaurant',
  'Hotel',
  'Coworking',
  'Office',
  'Retail',
];
// export const MOCK_PRODUCTS: IProduct[] = [
//   {
//     id: '1',
//     title: 'Nordic Wooden Dining Table',
//     vendor: 'ScandiHome',
//     minPieces: 4,
//     price: 12500,
//     image: ROUTES.S3('marketplace/table-1.png'),
//     space: ESpaceType.RESTAURANT,
//     categoryId: 'cat-1', // Seating (as example)
//     tags: ['tag-1', 'tag-3'],
//   },
//   {
//     id: '2',
//     title: 'Industrial Metal Chair',
//     vendor: 'LoftWorks',
//     minPieces: 10,
//     price: 3200,
//     image: ROUTES.S3('marketplace/table-1.png'),
//     space: ESpaceType.CAFE,
//     categoryId: 'cat-1',
//     tags: ['tag-2'],
//   },
//   {
//     id: '3',
//     title: 'Modern Office Desk',
//     vendor: 'WorkWell',
//     minPieces: 2,
//     price: 18000,
//     image: ROUTES.S3('marketplace/table-1.png'),
//     space: ESpaceType.COWORKING,
//     categoryId: 'cat-2', // Tables & Desks
//     tags: ['tag-4'],
//   },
//   {
//     id: '4',
//     title: 'Luxury Lobby Sofa',
//     vendor: 'ComfortElite',
//     minPieces: 1,
//     price: 45000,
//     image: ROUTES.S3('marketplace/table-1.png'),
//     space: ESpaceType.LOBBY,
//     categoryId: 'cat-4', // Lounge
//     tags: ['tag-3', 'tag-4'],
//   },
//   {
//     id: '5',
//     title: 'Minimalist Coffee Table',
//     vendor: 'ZenSpace',
//     minPieces: 5,
//     price: 7500,
//     image: ROUTES.S3('marketplace/table-1.png'),
//     space: ESpaceType.HOTEL_ROOM,
//     categoryId: 'cat-2',
//     tags: ['tag-3'],
//   },
//   {
//     id: '6',
//     title: 'Bistro Outdoor Set',
//     vendor: 'GardenLife',
//     minPieces: 4,
//     price: 15000,
//     image: ROUTES.S3('marketplace/table-1.png'),
//     space: ESpaceType.RESTAURANT,
//     categoryId: 'cat-6', // Outdoor
//     tags: ['tag-1'],
//   },
//   // Add more for pagination testing
//   ...Array.from({ length: 20 }).map((_, i) => ({
//     id: `extra-${i}`,
//     title: `Extra Product ${i + 7}`,
//     vendor: 'General Furnishings',
//     minPieces: 1,
//     price: 5000 + i * 1000,
//     image: ROUTES.S3('marketplace/table-1.png'),
//     space: ESpaceType.COWORKING,
//     categoryId: 'cat-3', // Storage
//     tags: ['tag-4'],
//   })),
// ];
