import dotenv from 'dotenv'
dotenv.config()

import { prisma } from '~/lib/db'

const INTEGRATIONS = [{ name: 'Slack', type: 'SLACK' as const }]

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
