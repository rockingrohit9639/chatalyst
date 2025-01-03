import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '~/lib/db'
import SyncIntegrationCard from './_components/sync-integration-card'
import AskNow from './_components/ask-now'

export default async function Home() {
  const { userId } = await auth()
  if (!userId) {
    return redirect('/')
  }

  const userIntegrations = await prisma.userIntegration.findMany({
    where: { user: { clerkId: userId } },
    select: {
      id: true,
      integration: true,
      lastSyncedAt: true,
    },
  })

  return (
    <div className="grid h-full divide-x md:grid-cols-5">
      <div className="col-span-full flex flex-col items-center justify-center gap-4 p-4 text-center md:col-span-4">
        <h1 className="text-2xl font-bold md:text-4xl">Chatalyst</h1>

        <AskNow />
      </div>

      <div className="hidden flex-col gap-4 bg-sidebar p-2 md:flex">
        {userIntegrations.map((userIntegration) => (
          <SyncIntegrationCard key={userIntegration.id} userIntegration={userIntegration} />
        ))}
      </div>
    </div>
  )
}
