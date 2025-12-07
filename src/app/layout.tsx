import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Header } from '@/components/common/Header';
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: 'CareerRaah',
  description: 'Your Personal AI Career Guide',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Alegreya:wght@400;700&family=Belleza&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased', 'h-full bg-background')}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">{children}</main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}
