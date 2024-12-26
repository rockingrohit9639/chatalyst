'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { SidebarProvider } from './ui/sidebar'
import { ThemeProvider } from 'next-themes'

type ProvidersProps = {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ClerkProvider>
      <SidebarProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </SidebarProvider>
    </ClerkProvider>
  )
}
