import {
  ECatalogColor,
  ECategory,
  EMaterial,
  ESpaceType,
  EStyle,
} from '@/shared/enums';

export const CATEGORIES = Object.values(ECategory) as ECategory[];
export const STYLES = Object.values(EStyle) as EStyle[];
export const MATERIALS = Object.values(EMaterial) as EMaterial[];
export const SPACE_TYPES = Object.values(ESpaceType) as ESpaceType[];
export const CATALOG_COLORS = Object.values(ECatalogColor) as ECatalogColor[];
