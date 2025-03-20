import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Verkefni 4',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="is">
      <body>{children}</body>
    </html>
  );
}