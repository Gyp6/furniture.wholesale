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
    <div className={'h-[calc(100dvh-64px)] overflow-hidden flex flex-col'}>
      <div
        className={
          'w-full bg-transparent px-10 py-5 flex items-center justify-between shrink-0'
        }
      >
        <div>
          <p
            className={
              'text-[11px] font-bold uppercase tracking-widest text-muted-foreground mb-1'
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
          'w-full px-10 py-4 flex flex-col lg:flex-row gap-[30px] flex-1 min-h-0 items-stretch'
        }
      >
        <div className={'flex flex-col min-h-0 flex-1'}>
          <h2 className={'text-2xl font-semibold mb-3'}>Orders</h2>
          <OrderTable />
        </div>

        <div
          className={'lg:w-[600px] w-full shrink-0 flex flex-col gap-6 min-h-0'}
        >
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
