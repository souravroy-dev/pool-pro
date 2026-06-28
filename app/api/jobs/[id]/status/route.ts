import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { getUser } from '@/lib/auth-helpers'
import { ok, unauth, forbidden, notFound, err, zodErr, serverErr } from '@/lib/api'

const TRANSITIONS: Record<string, string> = {
  ASSIGNED: 'IN_PROGRESS',
  IN_PROGRESS: 'COMPLETED',
}

const schema = z.object({
  status: z.enum(['IN_PROGRESS', 'COMPLETED']),
})

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const user = await getUser()
    if (!user) return unauth()
    if (user.role !== 'CLEANER') return forbidden()

    const parsed = schema.safeParse(await req.json())
    if (!parsed.success) return zodErr(parsed.error)

    const job = await db.job.findUnique({ where: { id } })
    if (!job) return notFound()
    if (job.cleanerId !== user.id) return forbidden()
    if (TRANSITIONS[job.status] !== parsed.data.status) {
      return err(
        'INVALID_TRANSITION',
        `Cannot go to ${parsed.data.status} from ${job.status}`,
      )
    }

    await db.job.update({
      where: { id },
      data: {
        status: parsed.data.status,
        ...(parsed.data.status === 'COMPLETED' && { completedAt: new Date() }),
      },
    })

    return ok({ status: parsed.data.status })
  } catch (e) {
    console.error('[status]', e)
    return serverErr()
  }
}
