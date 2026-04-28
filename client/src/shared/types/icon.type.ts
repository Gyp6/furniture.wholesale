import {
  BaseIconName,
  BrandMonochromeIconName,
  LogoIconName,
  LucideIconName,
  RoleIconName,
} from '@/shared/data/icons';

export type TIconProps = {
  size?: number | string;
  className?: string;
  color?: string;
};

export type TBrandProps = Omit<TIconProps, 'color'>;

export type IconName =
  | LucideIconName
  | BaseIconName
  | BrandMonochromeIconName
  | RoleIconName
  | LogoIconName;
