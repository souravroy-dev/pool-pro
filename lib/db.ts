import { PrismaClient } from '@/prisma/client/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const g = globalThis as unknown as { prisma: PrismaClient }

function makeClient() {
  const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN,
  })
  return new PrismaClient({ adapter })
}

export const db = g.prisma || makeClient()

if (process.env.NODE_ENV !== 'production') g.prisma = db
