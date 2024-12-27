import { Integration } from '@prisma/client'
import dotenv from 'dotenv'
dotenv.config()

import { prisma } from '~/lib/db'

const INTEGRATIONS: Omit<Integration, 'createdAt' | 'updatedAt' | 'id'>[] = [
  {
    name: 'Slack',
    type: 'SLACK',
    description: 'Integrate Slack to sync your messages and perform AI-powered searches.',
    color: '#E01E5A',
  },
]

async function main() {
  console.log('🟦 Seeding Integrations... 🟦')

  try {
    for (const integration of INTEGRATIONS) {
      await prisma.integration.upsert({
        where: { type: integration.type },
        create: integration,
        update: integration,
      })
      console.log(`🟩 Seeded ${integration.name} 🟩`)
    }

    console.log('🟢 Integrations seeded successfully.. 🟢')
  } catch (error) {
    console.log('🔴 Error seeding Integrations 🔴')
    console.error(error)
  }
}

main()
