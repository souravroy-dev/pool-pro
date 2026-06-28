import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getUser } from '@/lib/auth-helpers'
import { ok, unauth, forbidden, notFound, serverErr } from '@/lib/api'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const user = await getUser()
    if (!user) return unauth()

    const job = await db.job.findUnique({
      where: { id },
      include: {
        customer: { select: { id: true, name: true } },
        bids: {
          include: {
            cleaner: {
              select: {
                id: true,
                name: true,
                cleanerProfile: {
                  select: {
                    avgRating: true,
                    totalJobsDone: true,
                    experienceYears: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
        reviews: true,
      },
    })

    if (!job) return notFound()
    if (user.role === 'CUSTOMER' && job.customerId !== user.id)
      return forbidden()

    // Cleaner only sees their own bid price
    if (user.role === 'CLEANER' && job.cleanerId !== user.id) {
      job.bids = job.bids.filter((b) => b.cleanerId === user.id)
    }

    return ok(job)
  } catch (e) {
    console.error('[GET /jobs/:id]', e)
    return serverErr()
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const user = await getUser()
    if (!user) return unauth()
    const job = await db.job.findUnique({ where: { id } })
    if (!job) return notFound()
    if (job.customerId !== user.id) return forbidden()
    if (!['OPEN'].includes(job.status)) return forbidden()
    await db.job.update({
      where: { id },
      data: { status: 'CANCELLED' },
    })
    return ok({ cancelled: true })
  } catch (e) {
    return serverErr()
  }
}
