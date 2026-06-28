import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { getUser } from '@/lib/auth-helpers'
import { ok, unauth, forbidden, zodErr, serverErr } from '@/lib/api'
import { nearbyCleaners, distKm } from '@/lib/geo'

const createSchema = z.object({
  title: z.string().min(5).max(100),
  description: z.string().min(10).max(1000),
  poolType: z.enum(['INGROUND', 'ABOVE_GROUND', 'SPA', 'COMMERCIAL']),
  address: z.string().min(5),
  lat: z.number(),
  lng: z.number(),
  preferredDate: z.string().datetime(),
})

export async function POST(req: NextRequest) {
  try {
    const user = await getUser()
    if (!user) return unauth()
    if (user.role !== 'CUSTOMER') return forbidden()

    const parsed = createSchema.safeParse(await req.json())
    if (!parsed.success) return zodErr(parsed.error)

    const job = await db.job.create({
      data: {
        customerId: user.id,
        ...parsed.data,
        preferredDate: new Date(parsed.data.preferredDate),
      },
    })
    return ok({ jobId: job.id }, 201)
  } catch (e) {
    console.error('[POST /jobs]', e)
    return serverErr()
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getUser()
    if (!user) return unauth()
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')

    if (user.role === 'CUSTOMER') {
      const jobs = await db.job.findMany({
        where: {
          customerId: user.id,
          ...(status ? { status: status as any } : {}),
        },
        include: { _count: { select: { bids: true } } },
        orderBy: { createdAt: 'desc' },
      })
      return ok(jobs)
    }

    // CLEANER — return nearby OPEN jobs
    const profile = user.cleanerProfile
    if (!profile?.lat || !profile?.lng) return ok([])

    const allOpen = await db.job.findMany({
      where: { status: 'OPEN' },
      include: {
        customer: { select: { id: true, name: true } },
        _count: { select: { bids: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    const filtered = allOpen.filter(
      (j) =>
        distKm(profile.lat!, profile.lng!, j.lat, j.lng) <=
        profile.serviceRadiusKm,
    )
    return ok(filtered)
  } catch (e) {
    console.error('[GET /jobs]', e)
    return serverErr()
  }
}
