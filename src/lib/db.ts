import { PrismaClient } from '@prisma/client'

function prismaClientSingleton() {
  return new PrismaClient()
}

declare const globalThis: {
  prisma: ReturnType<typeof prismaClientSingleton>
} & typeof global

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = prismaClientSingleton()
} else {
  if (!globalThis.prisma) {
    globalThis.prisma = prismaClientSingleton()
  }
  prisma = globalThis.prisma
}

export { prisma }
