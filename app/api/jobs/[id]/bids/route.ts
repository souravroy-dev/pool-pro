import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { getUser } from '@/lib/auth-helpers'
import { ok, unauth, forbidden, notFound, err, zodErr, serverErr } from '@/lib/api'

const schema = z.object({
  price: z.number().min(10, 'Minimum bid is $10').max(10000),
  durationHours: z.number().min(0.5).max(24),
  message: z.string().min(10, 'Add a bit more detail').max(500),
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
    if (job.status !== 'OPEN')
      return err('NOT_OPEN', 'This job is not accepting bids')

    const existing = await db.bid.findUnique({
      where: { jobId_cleanerId: { jobId: id, cleanerId: user.id } },
    })
    if (existing) return err('ALREADY_BID', 'You already bid on this job', 409)

    const bid = await db.bid.create({
      data: { jobId: id, cleanerId: user.id, ...parsed.data },
    })
    return ok({ bidId: bid.id }, 201)
  } catch (e) {
    console.error('[POST bids]', e)
    return serverErr()
  }
}
