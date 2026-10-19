import { DesignerStatsData } from '@/shared/data/dashboard';

import { ICON_MAP } from './icon-map';

export function Statistics() {
  return (
    <div className={'grid grid-cols-2 gap-4'}>
      {DesignerStatsData.map(stat => (
        <div
          key={stat.label}
          className={
            'relative rounded-3xl border border-neutral-100 p-8 bg-white shadow-xl min-h-[208px]'
          }
        >
          <span
            className={`absolute top-3 right-3 text-[12px] font-semibold px-2 py-1 rounded-full ${stat.badgeColor}`}
          >
            {stat.badge}
          </span>
          <div
            className={
              'w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center mb-7'
            }
          >
            {ICON_MAP[stat.icon]}
          </div>
          <p className={'text-4xl font-normal tracking-tight'}>{stat.value}</p>
          <p
            className={
              'text-[13px] uppercase tracking-widest text-muted-foreground mt-5'
            }
          >
            {stat.label}
          </p>
        </div>
      ))}
    </div>
  );
}
