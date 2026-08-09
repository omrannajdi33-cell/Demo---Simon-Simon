import type { Metadata } from 'next';
import { StoreProvider } from '@/lib/store';
import './globals.css';

export const metadata: Metadata = {
  title: 'Simon & Simon — Prototype Démo',
  description: 'Plateforme de gestion pour Simon & Simon Esthétique Automobile — Prototype concept',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
