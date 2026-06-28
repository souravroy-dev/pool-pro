import { NextRequest } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { getUser } from '@/lib/auth-helpers'
import { ok, unauth, forbidden, notFound, err, zodErr, serverErr } from '@/lib/api'

export async function GET() {
  try {
    const user = await getUser()
    if (!user) return unauth()
    if (user.role !== 'CLEANER') return forbidden()

    const saved = await db.savedJob.findMany({
      where: { cleanerId: user.id },
      select: { jobId: true },
    })

    return ok(saved.map((s) => s.jobId))
  } catch (e) {
    console.error('[GET /saved-jobs]', e)
    return serverErr()
  }
}

const saveSchema = z.object({
  jobId: z.string().min(1),
})

export async function POST(req: NextRequest) {
  try {
    const user = await getUser()
    if (!user) return unauth()
    if (user.role !== 'CLEANER') return forbidden()

    const parsed = saveSchema.safeParse(await req.json())
    if (!parsed.success) return zodErr(parsed.error)

    const { jobId } = parsed.data

    // Verify job exists
    const job = await db.job.findUnique({ where: { id: jobId } })
    if (!job) return notFound()

    // Upsert — ignore if already saved
    await db.savedJob.upsert({
      where: { cleanerId_jobId: { cleanerId: user.id, jobId } },
      create: { cleanerId: user.id, jobId },
      update: {},
    })

    return ok({ saved: true }, 201)
  } catch (e) {
    console.error('[POST /saved-jobs]', e)
    return serverErr()
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getUser()
    if (!user) return unauth()
    if (user.role !== 'CLEANER') return forbidden()

    const { searchParams } = new URL(req.url)
    const jobId = searchParams.get('jobId')
    if (!jobId) return err('MISSING_JOB_ID', 'jobId query param is required')

    const record = await db.savedJob.findUnique({
      where: { cleanerId_jobId: { cleanerId: user.id, jobId } },
    })
    if (!record) return notFound()

    await db.savedJob.delete({ where: { id: record.id } })
    return ok({ unsaved: true })
  } catch (e) {
    console.error('[DELETE /saved-jobs]', e)
    return serverErr()
  }
}
