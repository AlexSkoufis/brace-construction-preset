import type { Metadata, Viewport } from 'next';
import { preload } from 'react-dom';
import { Archivo, JetBrains_Mono } from 'next/font/google';
import { srcSet } from '@/components/Img';
import { company } from '@/lib/content';
import './globals.css';

// Archivo is variable in weight AND width (wdth 62–125): the hero and footer animate the width axis.
const sans = Archivo({ subsets: ['latin'], axes: ['wdth'], variable: '--font-sans', display: 'swap' });
const mono = JetBrains_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono', display: 'swap' });

export const metadata: Metadata = {
  title: `${company.full} — ${company.line}`,
  description: `${company.full}: general contracting, design & build and infrastructure. A fictional construction company design concept.`,
};

export const viewport: Viewport = { themeColor: '#f6f5f2', width: 'device-width', initialScale: 1 };

const motionFlag = `try{if(matchMedia('(prefers-reduced-motion: no-preference)').matches)document.documentElement.classList.add('motion')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  preload('/img/hero-1200.avif', { as: 'image', imageSrcSet: srcSet('hero', 'avif'), imageSizes: '(orientation: portrait) 170vh, 100vw', type: 'image/avif', fetchPriority: 'high' });
  return (
    // suppressHydrationWarning: the inline script adds `motion` to <html> before hydration.
    <html lang="en" suppressHydrationWarning className={`${sans.variable} ${mono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionFlag }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
