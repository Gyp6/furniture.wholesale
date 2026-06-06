import { ROUTES } from '@/constants';

export const ProfileData = {
  companyName: 'Noble Furniture Co.',
  location: 'Milan, Italy',
  description:
    'Crafting sustainable, high-end modular furniture for the modern contract market. Our pieces are designed for longevity and architectural purity.',
  email: 'contact@noblefurniture.com',
  address: 'Via della Spiga, 15, Milan',
  leadTime: '4-8 Weeks',
  focusSegments: ['Restaurant', 'Hotel', 'Coworking'],
  banner: ROUTES.S3('profile/banner.jpg'),
  logo: ROUTES.S3('profile/logo.png'),
  preview: ROUTES.S3('profile/preview.jpg'),
  termsOfUse: ROUTES.S3('profile/terms.pdf'),
  curatorsType: [
    { label: 'Restaurant' },
    { label: 'Hotel' },
    { label: 'Coworking' },
  ],
};

export const LeadTimeOptions = [
  '1 - 2 Weeks',
  '2 - 4 Weeks',
  '4 - 8 Weeks',
  '8+ Weeks',
];

export const FocusSegmentOptions = [
  'Restaurant',
  'Hotel',
  'Coworking',
  'Retail',
  'Office',
  'Healthcare',
];
