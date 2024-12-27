'use client'

import { Prisma } from '@prisma/client'
import dayjs from 'dayjs'
import { useState } from 'react'
import { Button } from '~/components/ui/button'
import { cn } from '~/lib/utils'
import { syncIntegration } from '../integrations/actions'
import { toast } from 'sonner'

type SyncIntegrationCardProps = {
  className?: string
  style?: React.CSSProperties
  userIntegration: Prisma.UserIntegrationGetPayload<{
    select: {
      id: true
      integration: true
      lastSyncedAt: true
    }
  }>
}

export default function SyncIntegrationCard({ className, style, userIntegration }: SyncIntegrationCardProps) {
  const [isSyncing, setIsSyncing] = useState(false)

  function handleSyncIntegration() {
    setIsSyncing(true)

    syncIntegration(userIntegration.id)
      .then(() => {
        toast.success(`${userIntegration.integration.name} synced successfully.`)
      })
      .catch((error: Error) => {
        toast.error(error.message)
      })
      .finally(() => {
        setIsSyncing(false)
      })
  }

  return (
    <div className={cn('rounded border bg-white p-4', className)} style={style}>
      <p className="text-lg font-bold">{userIntegration.integration.name}</p>
      <p className="mb-2 text-sm text-muted-foreground">
        {userIntegration.lastSyncedAt
          ? `Last synced at ${dayjs(userIntegration.lastSyncedAt).format('DD/MM/YYYY hh:mm A')}`
          : 'Never synced yet'}
      </p>

      <Button size="sm" className="w-full" onClick={handleSyncIntegration} loading={isSyncing}>
        Sync now
      </Button>
    </div>
  )
}
