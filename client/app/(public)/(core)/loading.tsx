import { Skeleton } from '@shadcn/skeleton';

export default function Loading() {
  return (
    <div className={'flex items-center justify-center min-h-[50vh]'}>
      <div className={'space-y-4 w-full max-w-md p-10'}>
        <Skeleton className={'h-12 w-3/4'} />
        <Skeleton className={'h-4 w-full'} />
        <Skeleton className={'h-4 w-full'} />
        <Skeleton className={'h-4 w-2/3'} />
      </div>
    </div>
  );
}
