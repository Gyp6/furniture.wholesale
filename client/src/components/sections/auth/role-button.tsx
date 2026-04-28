import { Icon } from '@/components/ui';
import { cn } from '@/lib/cn';
import { RoleIconName } from '@/shared/data/icons';
import { TRole, TRoleButton } from '@/shared/types';

interface Props extends TRoleButton {
  isActive: boolean;
  onClick: (value: TRole) => void;
}

export function RoleButton({ value, label, icon, isActive, onClick }: Props) {
  return (
    <button
      type={'button'}
      onClick={() => onClick(value)}
      className={cn(
        'flex flex-col items-center gap-1 rounded-radius border p-3 text-xs font-medium transition-colors',
        isActive
          ? 'border-primary bg-white text-primary shadow-sm'
          : 'border-border bg-white text-muted-foreground hover:border-primary/40',
      )}
    >
      <Icon
        name={icon as RoleIconName}
        size={20}
      />
      {label}
    </button>
  );
}
