import dynamicIconImports from 'lucide-react/dynamicIconImports';
import { lazy } from 'react';

const toPascal = (kebab: string) =>
  kebab
    .split('-')
    .map(s => s[0].toUpperCase() + s.slice(1))
    .join('');

export const lucideRegistry = Object.entries(dynamicIconImports).reduce(
  (acc, [kebab, importFunc]) => {
    const pascal = toPascal(kebab);
    acc[pascal] = lazy(importFunc);
    return acc;
  },
  {} as Record<string, React.LazyExoticComponent<any>>,
);

export type LucideIconName = keyof typeof lucideRegistry;
