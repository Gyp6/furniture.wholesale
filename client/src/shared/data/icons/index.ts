import type { BRANDS_MONOCHROME } from './brands';
import type { ICONS } from './icons';
import type { LucideIconName } from './lucide-registry';
import type { ROLES } from './roles';
import type { LOGO } from './logo';

export * from './brands';
export * from './icons';
export * from './lucide-registry';
export * from './roles';
export * from './logo';

export type IconName =
  | LucideIconName
  | keyof typeof ICONS
  | keyof typeof BRANDS_MONOCHROME
  | keyof typeof ROLES
  | keyof typeof LOGO;


