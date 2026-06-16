import { useState } from 'react';

export function useCatalog() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 20000]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category],
    );
  };

  return {
    selectedCategories,
    toggleCategory,
    priceRange,
    setPriceRange,
  };
}
