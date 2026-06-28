import { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { getUser } from '@/lib/auth-helpers'
import { ok, unauth, forbidden, notFound, err, serverErr } from '@/lib/api'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params
    const user = await getUser()
    if (!user) return unauth()
    if (user.role !== 'CUSTOMER') return forbidden()

    const bid = await db.bid.findUnique({
      where: { id },
      include: {
        job: { include: { bids: { select: { id: true } } } },
      },
    })
    if (!bid) return notFound()
    if (bid.job.customerId !== user.id) return forbidden()
    if (bid.job.status !== 'OPEN')
      return err('NOT_OPEN', 'Job is no longer open')

    const loserIds = bid.job.bids
      .filter((b) => b.id !== bid.id)
      .map((b) => b.id)

    await db.$transaction([
      db.bid.update({ where: { id: bid.id }, data: { status: 'ACCEPTED' } }),
      ...(loserIds.length
        ? [
            db.bid.updateMany({
              where: { id: { in: loserIds } },
              data: { status: 'REJECTED' },
            }),
          ]
        : []),
      db.job.update({
        where: { id: bid.jobId },
        data: { status: 'ASSIGNED', cleanerId: bid.cleanerId },
      }),
    ])

    return ok({ assigned: true })
  } catch (e) {
    console.error('[accept bid]', e)
    return serverErr()
  }
}
