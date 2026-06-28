import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { getUser } from '@/lib/auth-helpers'
import { ok, unauth, forbidden, err, zodErr, serverErr } from '@/lib/api'

const schema = z.object({
  jobId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const user = await getUser()
    if (!user) return unauth()
    if (user.role !== 'CUSTOMER') return forbidden()

    const parsed = schema.safeParse(await req.json())
    if (!parsed.success) return zodErr(parsed.error)

    const { jobId, rating, comment } = parsed.data

    const job = await db.job.findUnique({ where: { id: jobId } })
    if (!job) return err('NOT_FOUND', 'Job not found', 404)
    if (job.customerId !== user.id) return forbidden()
    if (job.status !== 'COMPLETED')
      return err('NOT_DONE', 'Job is not completed yet')
    if (!job.cleanerId) return err('NO_CLEANER', 'No cleaner on this job')

    const existing = await db.review.findUnique({ where: { jobId } })
    if (existing) return err('ALREADY_REVIEWED', 'Already reviewed', 409)

    await db.$transaction(async (tx) => {
      await tx.review.create({
        data: {
          jobId,
          reviewerId: user.id,
          revieweeId: job.cleanerId!,
          rating,
          comment,
        },
      })

      // Update cleaner avg rating + job count
      const reviews = await tx.review.findMany({
        where: { revieweeId: job.cleanerId! },
        select: { rating: true },
      })
      const avg =
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      await tx.cleanerProfile.update({
        where: { userId: job.cleanerId! },
        data: {
          avgRating: Math.round(avg * 10) / 10,
          totalJobsDone: { increment: 1 },
        },
      })
    })

    return ok({ reviewed: true }, 201)
  } catch (e) {
    console.error('[review]', e)
    return serverErr()
  }
}
