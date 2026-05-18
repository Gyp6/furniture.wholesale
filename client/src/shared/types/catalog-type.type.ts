import { CatalogTypes } from '@/constants';

export type TCatalogTypes = typeof CatalogTypes;
export type TCatalogTypesKeys = keyof TCatalogTypes;
export type TCatalogTypesValues = TCatalogTypes[TCatalogTypesKeys];
