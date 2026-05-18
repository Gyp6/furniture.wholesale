'use client';

import { FilterBadge } from '@ui/filter-badge';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/shadcn/button';
import { useGetCategories, useGetTags } from '@/hooks/queries';

export function FilterBadgeGrid() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { data: categories } = useGetCategories();
  const { data: tags } = useGetTags();

  const spaces = searchParams.get('spaces')?.split(',').filter(Boolean) || [];
  const selectedCategories =
    searchParams.get('categories')?.split(',').filter(Boolean) || [];
  const selectedTags =
    searchParams.get('tags')?.split(',').filter(Boolean) || [];
  const search = searchParams.get('search');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');

  const removeFilter = (key: string, value: string, current: string[]) => {
    const newValues = current.filter(v => v !== value);
    const params = new URLSearchParams(searchParams.toString());
    if (newValues.length) {
      params.set(key, newValues.join(','));
    } else {
      params.delete(key);
    }
    params.delete('page'); // Reset page
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const clearAll = () => {
    router.push(pathname, { scroll: false });
  };

  const hasFilters =
    spaces.length > 0 ||
    selectedCategories.length > 0 ||
    selectedTags.length > 0 ||
    search ||
    minPrice ||
    maxPrice;

  if (!hasFilters) return null;

  return (
    <div className={'flex items-center flex-wrap gap-2'}>
      {search && (
        <FilterBadge
          title={`Search: ${search}`}
          action={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('search');
            params.delete('page');
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
          }}
        />
      )}

      {selectedCategories.map(catId => {
        const cat = categories?.find(c => c.id === catId);
        return (
          <FilterBadge
            key={catId}
            title={cat?.title || catId}
            action={() => removeFilter('categories', catId, selectedCategories)}
          />
        );
      })}

      {spaces.map(space => (
        <FilterBadge
          key={space}
          title={space}
          action={() => removeFilter('spaces', space, spaces)}
        />
      ))}

      {selectedTags.map(tagId => {
        const tag = tags?.find(t => t.id === tagId);
        return (
          <FilterBadge
            key={tagId}
            title={tag?.title || tagId}
            action={() => removeFilter('tags', tagId, selectedTags)}
          />
        );
      })}

      {(minPrice || maxPrice) && (
        <FilterBadge
          title={`Price: $${minPrice || 0} - $${maxPrice || 50000}`}
          action={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete('minPrice');
            params.delete('maxPrice');
            params.delete('page');
            router.push(`${pathname}?${params.toString()}`, { scroll: false });
          }}
        />
      )}

      <Button
        variant={'link'}
        size={'xs'}
        className={'text-sm text-secondary'}
        onClick={clearAll}
      >
        Clear all
      </Button>
    </div>
  );
}
