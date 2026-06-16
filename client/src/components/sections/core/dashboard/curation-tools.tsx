import { CurationToolsData } from '@/shared/data/dashboard';

import { ICON_MAP } from './icon-map';

export function CurationTools() {
  return (
    <div className={'grid grid-cols-2 gap-4'}>
      {CurationToolsData.map(tool => (
        <div
          key={tool.title}
          className={
            'rounded-3xl border border-neutral-100 p-3 bg-white flex items-center gap-2 cursor-pointer hover:bg-secondary/5 transition-colors min-h-21'
          }
        >
          <div
            className={
              'w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0'
            }
          >
            {ICON_MAP[tool.icon]}
          </div>
          <div>
            <p className={'text-sm font-semibold'}>{tool.title}</p>
            <p className={'text-[11px] text-muted-foreground'}>
              {tool.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
