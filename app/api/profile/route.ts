import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { getUser } from '@/lib/auth-helpers'
import { ok, unauth, zodErr, serverErr } from '@/lib/api'

const cleanerSchema = z.object({
  name: z.string().min(2),
  bio: z.string().max(500).optional(),
  experienceYears: z.coerce.number().int().min(0).max(50),
  serviceRadiusKm: z.coerce.number().min(1).max(200),
  lat: z.coerce.number(),
  lng: z.coerce.number(),
})

export async function GET() {
  try {
    const user = await getUser()
    if (!user) return unauth()
    return ok(user)
  } catch (e) {
    return serverErr()
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getUser()
    if (!user) return unauth()
    const body = await req.json()

    if (user.role === 'CLEANER') {
      const parsed = cleanerSchema.safeParse(body)
      if (!parsed.success) return zodErr(parsed.error)
      const { name, bio, experienceYears, serviceRadiusKm, lat, lng } =
        parsed.data
      await db.$transaction([
        db.user.update({ where: { id: user.id }, data: { name } }),
        db.cleanerProfile.update({
          where: { userId: user.id },
          data: { bio, experienceYears, serviceRadiusKm, lat, lng },
        }),
      ])
    } else {
      const parsed = z
        .object({ name: z.string().min(2), address: z.string().optional() })
        .safeParse(body)
      if (!parsed.success) return zodErr(parsed.error)
      await db.user.update({
        where: { id: user.id },
        data: { name: parsed.data.name },
      })
    }

    return ok({ updated: true })
  } catch (e) {
    return serverErr()
  }
}
