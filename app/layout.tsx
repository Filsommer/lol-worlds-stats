import './globals.css';

import { Analytics } from '@vercel/analytics/react';

import { Inter as FontSans } from 'next/font/google';
import { cn } from '../lib/utils';
import { ThemeProvider } from '../@/components/theme-provider';

export const metadata = {
  title: 'LoL Worlds 2023 Stats',
  description: 'LoL Worlds 2023 Stats.'
};

export const fontSans = FontSans({
  subsets: ['latin'],
  variable: '--font-sans'
});

export default async function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body
        className={cn('min-h-screen font-sans antialiased', fontSans.variable)}
      >
        <ThemeProvider attribute="class" defaultTheme="system">
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
