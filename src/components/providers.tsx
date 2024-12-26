'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { SidebarProvider } from './ui/sidebar'
import { ThemeProvider } from 'next-themes'
import { useEffect, useState } from 'react'

type ProvidersProps = {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

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
