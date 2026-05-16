// components/role-card.tsx
import Image from 'next/image';

import { Icon } from '@/components/ui/icon';
import { cn } from '@/lib/cn';
import type { TRoleCard } from '@/shared/types';

interface Props extends TRoleCard {
  onClick?: (value: TRoleCard['value']) => void;
}

export const RoleCard = ({
  value,
  title,
  description,
  label,
  image,
  onClick,
}: Props) => {
  return (
    <button
      type={'button'}
      onClick={() => onClick?.(value)}
      className={cn(
        'group relative flex flex-col justify-end overflow-hidden rounded-3xl',
        'w-full aspect-3/4 text-left cursor-pointer active:translate-y-0.5',
        'ring-2 ring-transparent transition-all duration-200 opacity-80 hover:opacity-100',
      )}
    >
      <Image
        fill
        unoptimized={process.env.NODE_ENV === 'development'}
        src={image}
        alt={title}
        className={'absolute inset-0 h-full w-full object-cover'}
      />

      <div
        className={
          'absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent'
        }
      />

      <div className={'relative flex flex-col gap-4 p-5'}>
        <h3 className={'text-xl font-semibold text-white'}>{title}</h3>

        <ul className={'flex flex-col gap-1.5'}>
          {description.map(item => (
            <li
              key={item}
              className={'flex items-center gap-2 text-xs text-white/90'}
            >
              <Icon
                name={'CircleCheck'}
                size={16}
                color={'currentColor'}
                className={'shrink-0'}
              />
              {item}
            </li>
          ))}
        </ul>

        <div
          className={
            'mt-1 flex items-center justify-center rounded-full bg-white px-4 py-2.5'
          }
        >
          <span className={'text-sm font-medium text-black'}>
            Select {label}
          </span>
        </div>
      </div>
    </button>
  );
};
