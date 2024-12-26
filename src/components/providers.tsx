'use client'

import { ClerkProvider } from '@clerk/nextjs'
import { SidebarProvider } from './ui/sidebar'

type ProvidersProps = {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <ClerkProvider>
      <SidebarProvider>{children}</SidebarProvider>
    </ClerkProvider>
  )
}
