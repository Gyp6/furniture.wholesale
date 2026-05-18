import { ICONS } from '@/shared/data/icons';

export const ICON_MAP: Record<string, React.ReactNode> = {
  Cart: (
    <ICONS.Cart
      size={20}
      color={'currentColor'}
      className={'text-muted-foreground'}
    />
  ),
  Bundles: (
    <ICONS.Bundles
      size={20}
      color={'currentColor'}
      className={'text-muted-foreground'}
    />
  ),
  Market: (
    <ICONS.Market
      size={20}
      color={'currentColor'}
      className={'text-muted-foreground'}
    />
  ),
  Stonks: (
    <ICONS.Stonks
      size={20}
      color={'currentColor'}
      className={'text-muted-foreground'}
    />
  ),
};
