import { PrismaClient } from '@/prisma/client/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

const g = globalThis as unknown as { prisma: PrismaClient }

function makeClient() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL! })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

export const db = g.prisma || makeClient()

if (process.env.NODE_ENV !== 'production') g.prisma = db
