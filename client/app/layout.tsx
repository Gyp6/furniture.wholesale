import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';

import { DevtoolsProvider, QueryProvider } from '@/providers';

import './globals.scss';
import './tailwind.css';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'],
  display: 'swap',
});

const mono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Gyp6.sale',
    template: '%s | Gyp6.sale',
  },
  description: 'The B2B furniture marketplace for professionals',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={'en'}
      className={`${inter.variable} ${mono.variable} h-full antialiased`}
    >
      <body>
        <QueryProvider>
          {children}
          <DevtoolsProvider />
        </QueryProvider>
      </body>
    </html>
  );
}
