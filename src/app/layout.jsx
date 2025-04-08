import { Metadata } from 'next'
import { inter, montserrat } from '@/styles/fonts'
import Background from '@/components/background'
import '@/styles/globals.css'

export const metadata = {
  title: 'ODS 8th Grade Dance Slideshow',
  description: 'ODS 8th Grade Dance Slideshow',
  author: 'Meg Castle',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }) {
  return (
      <html lang="en">
          <head>
              <link rel="stylesheet" href="https://use.typekit.net/hqw6iif.css" />
          </head>
          <body className={`${inter.variable} ${montserrat.variable} antialiased`}>
            <main className="relative z-10 size-full">{children}</main>
            <Background />
          </body>
      </html>
  )
}
