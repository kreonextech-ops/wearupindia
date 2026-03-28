import type { Metadata } from 'next';
import './globals.css';
import { StoreProvider } from '@/lib/store-context';
import LayoutWrapper from '@/components/layout/LayoutWrapper';

export const metadata: Metadata = {
  title: 'WearUp – Ride Bold. Wrap Louder.',
  description: 'Premium motorcycle wraps, accessories, detailing and merch for the modern Indian rider.',
  keywords: 'motorcycle wrap india, bike stickers, helmet, bike accessories, riding gear',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <StoreProvider>
          <LayoutWrapper>
            {children}
          </LayoutWrapper>
        </StoreProvider>
      </body>
    </html>
  );
}
