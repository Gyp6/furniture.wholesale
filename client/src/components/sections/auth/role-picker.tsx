'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/shadcn/dialog';
import { Label } from '@/components/ui/shadcn/label';
import { RoleCardsConfig } from '@/config';
import { useRegisterForm } from '@/hooks';
import { TRole } from '@/shared/types';

import { RoleCard } from './role-card';

export function RolePicker() {
  const pathname = usePathname();

  const { role, setRole } = useRegisterForm();
  const [isManuallyClosed, setIsManuallyClosed] = useState(false);
  const isOpen = pathname === '/register' && !role && !isManuallyClosed;

  const handleRoleSelect = (selected: TRole) => {
    setRole(selected);
    setTimeout(() => 300);
  };

  return (
    <div className={'p-10'}>
      <Dialog
        open={isOpen}
        onOpenChange={open => !open && setIsManuallyClosed(true)}
        modal
      >
        <DialogContent
          className={'sm:max-w-5/6 sm:max-h-5/6 p-12 gap-6'}
          onPointerDownOutside={e => e.preventDefault()}
          onEscapeKeyDown={e => e.preventDefault()}
          showCloseButton={false}
        >
          <DialogHeader>
            <DialogDescription>
              <Label
                variant={'figma'}
                accent
              >
                Get Started
              </Label>
            </DialogDescription>
            <DialogTitle
              className={'text-heading font-semibold inline-flex gap-3'}
            >
              Choose your{' '}
              <span className={'text-secondary'}> professional </span> path.
            </DialogTitle>
          </DialogHeader>

          <div className={'flex gap-4 mt-4'}>
            {RoleCardsConfig.map(item => (
              <RoleCard
                key={item.value}
                {...item}
                onClick={handleRoleSelect}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
