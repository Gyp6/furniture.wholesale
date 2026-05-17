import { CatalogSearch } from './search';

interface Props {
  title: string;
}

export function CatalogHeader({ title }: Props) {
  return (
    <div className={'flex items-center justify-between w-full'}>
      <h2
        className={
          'text-4xl font-bold tracking-tight text-primary whitespace-nowrap'
        }
      >
        {title}
      </h2>

      <CatalogSearch />
    </div>
  );
}
