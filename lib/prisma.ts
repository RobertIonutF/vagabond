import { PrismaClient } from '@prisma/client'
import { PrismaNeon } from '@prisma/adapter-neon'
import { Pool } from '@neondatabase/serverless'

declare global {
  var prisma: PrismaClient | undefined
}

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL!
  const pool = new Pool({ connectionString })
  const adapter = new PrismaNeon(pool)
  return new PrismaClient({ adapter })
}

const prisma = global.prisma || createPrismaClient()

if (process.env.NODE_ENV !== 'production') global.prisma = prisma

export default prisma