import { Button } from '@shadcn/button';

import {
  ActiveProjects,
  CurationTools,
  OrderTable,
  Statistics,
} from '@/components/sections/core/dashboard';
import { ICONS } from '@/shared/data/icons';
import { ISession } from '@/shared/types';

interface Props {
  user?: ISession['user'];
}

export function DashboardPage({ user }: Props) {
  return (
    <div className={'flex flex-col w-full'}>
      <div
        className={
          'w-full bg-transparent flex items-center justify-between shrink-0'
        }
      >
        <div>
          <p
            className={
              'text-base font-bold uppercase tracking-widest text-muted-foreground mb-1'
            }
          >
            {user?.role ?? 'CURATOR'} OVERVIEW
          </p>
          <h1 className={'text-3xl font-bold tracking-tight'}>
            Welcome back, {user?.name ?? 'there'}!
          </h1>
        </div>
        <Button
          className={'rounded-full gap-2'}
          variant={'default'}
        >
          <ICONS.Bundle
            size={16}
            color={'currentColor'}
          />
          Create Bundle
        </Button>
      </div>

      <div
        className={
          'w-full py-4 flex flex-col lg:flex-row gap-10 flex-1 min-h-0'
        }
      >
        <div className={'flex flex-col w-full min-h-0'}>
          <h2 className={'text-2xl font-semibold mb-3'}>Orders</h2>
          <OrderTable />
        </div>

        <div className={'w-[700px] shrink-0 flex flex-col gap-6'}>
          <div>
            <h2 className={'text-2xl font-semibold mb-3'}>Statistics</h2>
            <Statistics />
          </div>

          <div>
            <h2 className={'text-2xl font-semibold mb-3'}>Active Projects</h2>
            <ActiveProjects />
          </div>
          <div>
            <h2 className={'text-2xl font-semibold mb-3'}>Curation Tools</h2>
            <CurationTools />
          </div>
        </div>
      </div>
    </div>
  );
}