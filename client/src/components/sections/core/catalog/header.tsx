import { CatalogSearch } from './search';

interface Props {
  title: string;
}

export function CatalogHeader({ title }: Props) {
  return (
    <div className={'flex flex-wrap items-center justify-between gap-8 w-full'}>
      <h2
        className={
          'text-5xl font-bold tracking-tight text-foreground whitespace-nowrap'
        }
      >
        {title}
      </h2>

      <CatalogSearch />
    </div>
  );
}
