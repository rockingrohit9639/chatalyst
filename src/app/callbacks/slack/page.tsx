'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { toast } from 'sonner'

export default function SlackCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const code = searchParams.get('code')

  useEffect(() => {
    if (!code) {
      return
    }

    function sendCodeToCallback() {
      fetch('/api/callbacks/slack', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
        })
        .catch(() => {
          router.replace('/')
          toast.error('Something went wrong while linking with slack.')
        })
    }

    sendCodeToCallback()
  }, [code, router])

  return <div>This is slack callback</div>
}
