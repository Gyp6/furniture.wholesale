'use client';

import { FilterBadge } from '@ui/filter-badge';
import { useState } from 'react';

import { Button } from '@/components/ui/shadcn/button';
import { filterBadgeData as initialData } from '@/shared/data/core/catalog';

export function FilterBadgeGrid() {
  const [badges, setBadges] = useState(initialData);

  const handleDeleteBadge = (id: string) => {
    setBadges(prev => prev.filter(item => item.id !== id));
    console.log('Deleted:', id);
  };

  const handleClearAll = () => {
    setBadges([]);
  };

  return (
    <div className={'flex items-center flex-wrap gap-2'}>
      {badges.map(item => (
        <FilterBadge
          key={item.id}
          {...item}
          action={() => handleDeleteBadge(item.id)}
        />
      ))}

      <Button
        variant={'link'}
        size={'xs'}
        className={'text-sm text-secondary'}
        onClick={handleClearAll}
      >
        Clear all
      </Button>
    </div>
  );
}
