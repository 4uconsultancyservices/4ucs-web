import type { Metadata, Viewport } from 'next';
import { DM_Sans, DM_Mono, Bricolage_Grotesque } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['300','400','500'], variable: '--font-mono', display: 'swap' });
const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-display', display: 'swap' });

export const metadata: Metadata = {
  title: { default: '4UCS — Launch in Days. Scale Globally.', template: '%s | 4UCS' },
  description: '4U Consultancy Services — Enterprise SaaS consulting, digital transformation, and cloud architecture. Launch faster, scale smarter.',
  keywords: ['SaaS consulting','enterprise technology','digital transformation','cloud solutions','4UCS','4U Consultancy Services'],
  authors: [{ name: '4U Consultancy Services', url: 'https://4ucs.com' }],
  openGraph: {
    type: 'website', locale: 'en_US', url: 'https://4ucs.com',
    title: '4UCS — Launch in Days. Scale Globally.',
    description: 'Enterprise SaaS consulting and digital transformation.',
    siteName: '4UCS',
  },
  twitter: { card: 'summary_large_image', creator: '@4ucs' },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large' } },
};

export const viewport: Viewport = {
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#030712' }],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable} ${bricolage.variable} dark`} suppressHydrationWarning>
      <body className="bg-[#030712] text-white antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
