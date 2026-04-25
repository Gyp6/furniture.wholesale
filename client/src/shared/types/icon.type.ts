export type TIconProps = {
  size?: number | string;
  className?: string;
  color?: string;
};

export type TBrandProps = Omit<TIconProps, 'color'>;
