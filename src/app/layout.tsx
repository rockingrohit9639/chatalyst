import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import '../styles/globals.css'
import Providers from '~/components/providers'
import { AppSidebar } from '~/components/app-sidebar/app-sidebar'
import { SidebarInset } from '~/components/ui/sidebar'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Chatalyst',
  description: 'AI-powered platform for searching messages across messengers.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          <AppSidebar />
          <SidebarInset>{children}</SidebarInset>
        </Providers>
      </body>
    </html>
  )
}
