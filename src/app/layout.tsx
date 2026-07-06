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
import { Inter, Outfit, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-body', display: 'swap' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-display', display: 'swap' });
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} ${jetbrains.variable} antialiased font-body`}>
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
