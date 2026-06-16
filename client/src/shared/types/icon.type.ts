import {
  BaseIconName,
  BrandMonochromeIconName,
  LogoIconName,
  RoleIconName,
} from '@/shared/data/icons';

export type TIconProps = {
  size?: number | string;
  className?: string;
  color?: string;
};

export type TBrandProps = Omit<TIconProps, 'color'>;

export type IconName =
  | BaseIconName
  | BrandMonochromeIconName
  | RoleIconName
  | LogoIconName;
