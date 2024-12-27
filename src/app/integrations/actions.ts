'use server'

import { auth } from '@clerk/nextjs/server'
import { UserIntegration } from '@prisma/client'
import { prisma } from '~/lib/db'
import { INTEGRATION_SYNC_FUNCTIONS } from '~/lib/integrations/utils'

export async function syncIntegration(id: UserIntegration['id']) {
  const { userId } = await auth()
  if (!userId) {
    throw new Error('User not authenticated')
  }

  const userIntegration = await prisma.userIntegration.findFirst({
    where: { id, user: { clerkId: userId } },
    include: { integration: true },
  })
  if (!userIntegration) {
    throw new Error('Integration does not exists or is not allowed for current user.')
  }

  const syncFunction = INTEGRATION_SYNC_FUNCTIONS[userIntegration.integration.type]
  await syncFunction(userIntegration)

  await prisma.userIntegration.update({
    where: { id },
    data: { lastSyncedAt: new Date() },
  })

  return { success: true }
}
