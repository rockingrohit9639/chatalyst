import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { prisma } from '~/lib/db'
import dayjs from 'dayjs'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

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

        <Input className="md:max-w-screen-sm" placeholder="What do you want do ask today?" />
        <Button>Ask now</Button>
      </div>

      <div className="hidden flex-col gap-4 bg-sidebar p-2 md:flex">
        {userIntegrations.map((userIntegration) => (
          <div key={userIntegration.id} className="rounded border bg-sidebar-accent p-4">
            <p className="text-lg font-bold">{userIntegration.integration.name}</p>
            <p className="mb-2 text-sm text-muted-foreground">
              {userIntegration.lastSyncedAt
                ? `Last synced at ${dayjs(userIntegration.lastSyncedAt).format('DD/MM/YYYY hh:mm:aa')}`
                : 'Never synced yet'}
            </p>

            <Button size="sm" className="w-full py-1 !text-sm">
              Sync now
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
