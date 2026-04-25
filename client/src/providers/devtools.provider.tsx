'use client';

// import { ReactFormDevtools } from '@tanstack/react-form-devtools';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// import { ReactTableDevtools } from '@tanstack/react-table-devtools';

export function DevtoolsProvider() {
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <>
      <ReactQueryDevtools
        initialIsOpen={false}
        buttonPosition={'bottom-right'}
      />

      {/* <ReactTableDevtools initialIsOpen={false} /> */}
      {/* <ReactFormDevtools initialIsOpen={false} /> */}
    </>
  );
}
