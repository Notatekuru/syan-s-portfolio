import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Mind Melody — Syan',
  description: 'Mengenal manusia lewat psikologi, musik, dan riset. Catatan kecil dari pikiran Isyana Arlisya.',
  generator: 'v0.app',
  icons: {
    icon: '/placeholder.jpg',
    apple: '/placeholder.jpg',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#FAF6EF',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="id">
      <body className="antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
