import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.indianwells.us'),
  title: 'Palmhouse Indian Wells | Private Pool & Desert Retreat',
  description:
    'A private 3-bedroom Indian Wells vacation home with a pool and spa, close to tennis, golf, Coachella, and Stagecoach.',
  icons: {
    icon: '/images/logo-palm-houses.png',
    apple: '/images/logo-palm-houses.png',
  },
  openGraph: {
    title: 'Palmhouse Indian Wells',
    description: 'A quieter kind of desert escape.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'Palmhouse Indian Wells — A quieter kind of desert escape.',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Palmhouse Indian Wells',
    description: 'A quieter kind of desert escape.',
    images: ['/og.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
