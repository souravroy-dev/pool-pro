import { getServerSession } from 'next-auth'
import { authOptions } from './auth'
import { db } from './db'

export async function getUser() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return null
  const id = (session.user as any).id as string
  return db.user.findUnique({
    where: { id },
    include: { customerProfile: true, cleanerProfile: true },
  })
}
