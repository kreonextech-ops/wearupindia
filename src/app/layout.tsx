import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/lib/store-context';
import LayoutWrapper from '@/components/layout/LayoutWrapper';

export const metadata: Metadata = {
  title: 'WearUp Gfx | Ride Bold. Wrap Louder.',
  description: 'Premium motorcycle wraps, accessories, detailing and merch for the modern Indian rider.',
  keywords: 'motorcycle wrap india, bike stickers, helmet, bike accessories, riding gear',
};

import { ThemeProvider } from '@/components/providers/ThemeProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased font-body">
        <ThemeProvider>
          <StoreProvider>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </StoreProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
