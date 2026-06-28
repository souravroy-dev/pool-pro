import { NextRequest } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { ok, err, zodErr, serverErr } from '@/lib/api'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8, 'Password must be 8+ characters'),
  role: z.enum(['CUSTOMER', 'CLEANER']),
})

export async function POST(req: NextRequest) {
  try {
    const parsed = schema.safeParse(await req.json())
    if (!parsed.success) return zodErr(parsed.error)

    const { name, email, password, role } = parsed.data
    const existing = await db.user.findUnique({ where: { email } })
    if (existing) return err('EMAIL_TAKEN', 'Email already registered', 409)

    const hash = await bcrypt.hash(password, 10)
    await db.$transaction(async (tx) => {
      const user = await tx.user.create({ data: { name, email, password: hash, role } })
      if (role === 'CUSTOMER') await tx.customerProfile.create({ data: { userId: user.id } })
      else await tx.cleanerProfile.create({ data: { userId: user.id } })
    })

    return ok({ registered: true }, 201)
  } catch (e) {
    console.error('[register]', e)
    return serverErr()
  }
}
