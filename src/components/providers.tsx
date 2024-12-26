'use client'

import { ClerkProvider } from '@clerk/nextjs'

type ProvidersProps = {
  children: React.ReactNode
}

export default function Providers({ children }: ProvidersProps) {
  return <ClerkProvider>{children}</ClerkProvider>
}
