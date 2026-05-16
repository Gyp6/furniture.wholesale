'use client';

import { useState } from 'react';

import { ICONS } from '@/shared/data/icons';

type TProjectHeaderProps = {
  title?: string;
};

export function ProjectHeader({
  title: initialTitle = 'Project Bundle #1',
}: TProjectHeaderProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(initialTitle);

  return (
    <div className={'flex items-center gap-3'}>
      {isEditing ? (
        <input
          autoFocus
          value={title}
          onChange={e => setTitle(e.target.value)}
          onBlur={() => setIsEditing(false)}
          onKeyDown={e => e.key === 'Enter' && setIsEditing(false)}
          className={
            'text-2xl font-bold tracking-tight border-b border-neutral-300 outline-none bg-transparent'
          }
        />
      ) : (
        <h1 className={'text-4xl font-medium tracking-tight'}>{title}</h1>
      )}
      <button
        onClick={() => setIsEditing(true)}
        className={
          'w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center hover:bg-secondary/20 transition-colors border-0'
        }
      >
        <ICONS.PenFigma
          size={16}
          color={'currentColor'}
          className={'text-secondary'}
        />
      </button>
    </div>
  );
}
