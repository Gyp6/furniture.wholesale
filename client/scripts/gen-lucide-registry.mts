// scripts/gen-lucide-registry.mts
import { writeFileSync } from 'fs';

const { default: dynamicIconImports } =
  await import('../node_modules/lucide-react/dist/esm/dynamicIconImports.mjs');

const toPascal = (kebab: string) =>
  kebab
    .split('-')
    .map((s: string) => s[0].toUpperCase() + s.slice(1))
    .join('');

const seen = new Set<string>();
const entries = Object.entries(
  dynamicIconImports as Record<string, () => Promise<any>>,
).filter(([kebab]) => {
  const pascal = toPascal(kebab);
  if (seen.has(pascal)) return false;
  seen.add(pascal);
  return true;
});

const lines = entries.map(([kebab]) => {
  const pascal = toPascal(kebab);
  return `  ${pascal}: lazy(() => import('lucide-react/dist/esm/icons/${kebab}.mjs').then(m => ({ default: m.default ?? m.${pascal} }))),`;
});

const content = `// AUTO-GENERATED — не редагуй вручну
// npm run gen:icons
import { lazy } from 'react';

export const lucideRegistry: Record<string, React.LazyExoticComponent<any>> = {
${lines.join('\n')}
};

export type LucideIconName = keyof typeof lucideRegistry;
`;

writeFileSync('src/shared/data/icons/lucide-registry.ts', content);
console.log(`✓ Generated ${entries.length} lucide icon entries`);
