'use client';

import { ArrowUpRight } from 'lucide-react';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/shadcn/carousel';
import { ProjectsData } from '@/shared/data/dashboard';

export function ActiveProjects() {
  return (
    <Carousel
      opts={{ align: 'start', dragFree: true }}
      className={'w-full'}
    >
      <CarouselPrevious
        className={
          'left-0 top-1/2 w-10 h-10 bg-secondary/10 border-none hover:bg-secondary/20 text-secondary'
        }
      />
      <CarouselContent className={'-ml-3'}>
        {ProjectsData.map((project, i) => (
          <CarouselItem
            key={i}
            className={'pl-2 basis-37.5'}
          >
            <div
              className={
                'rounded-3xl border border-neutral-100 p-4 bg-white flex flex-col justify-between min-h-40'
              }
            >
              <div className={'flex justify-end'}>
                <div
                  className={
                    'w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center'
                  }
                >
                  <ArrowUpRight className={'w-4 h-4 text-secondary'} />
                </div>
              </div>
              <div>
                <p className={'text-xl font-semibold leading-tight'}>
                  {project.title}
                </p>
                <p className={'text-sm text-muted-foreground mt-1'}>
                  {project.units} Units
                </p>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNext
        className={
          'right-0 top-1/2 w-10 h-10 bg-secondary/10 border-none hover:bg-secondary/20 text-secondary'
        }
      />
    </Carousel>
  );
}
