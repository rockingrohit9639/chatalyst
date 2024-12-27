import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Button } from '~/components/ui/button'
import { prisma } from '~/lib/db'

export default async function IntegrationsPage() {
  const { userId } = await auth()
  if (!userId) {
    throw redirect('/')
  }

  const userIntegrations = await prisma.userIntegration.findMany({
    where: { user: { clerkId: userId } },
    select: { id: true, integration: { select: { type: true } } },
  })
  const userIntegrationTypes = userIntegrations.map(({ integration }) => integration.type)
  const allIntegrations = await prisma.integration.findMany({})

  return (
    <div className="grid h-full gap-4 p-4 sm:grid-cols-2 md:grid-cols-3">
      {allIntegrations.map((integration) => {
        const isIntegrated = userIntegrationTypes.includes(integration.type)

        return (
          <div key={integration.id} className="relative h-max overflow-hidden rounded-lg border p-4">
            <h1 className="mb-1 font-bold md:text-2xl">{integration.name}</h1>
            <p className="mb-4 text-muted-foreground">{integration.description}</p>

            <Button className="w-full font-medium" disabled={isIntegrated}>
              <Link href={`/integrations/${integration.type.toLowerCase()}`}>
                {isIntegrated ? 'Connected' : 'Connect now'}
              </Link>
            </Button>

            <div className="absolute right-0 top-0 size-10 -translate-y-1/2 translate-x-1/2 rotate-45 bg-red-500" />
          </div>
        )
      })}
    </div>
  )
}
