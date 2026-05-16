import { CatalogSearch } from './search';

export function CatalogHeader() {
  return (
    <div className={'flex items-center justify-between w-full'}>
      <h2
        className={
          'text-4xl font-bold tracking-tight text-primary whitespace-nowrap'
        }
      >
        Catalog with Items
      </h2>

      <CatalogSearch />
    </div>
  );
}
