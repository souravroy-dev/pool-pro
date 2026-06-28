import { db } from '@/lib/db'
import { getUser } from '@/lib/auth-helpers'
import { notFound, redirect } from 'next/navigation'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { BidForm } from '@/components/bids/BidForm'
import { POOL_TYPES } from '@/lib/constants'
import { fmtDate } from '@/lib/utils'
import { JobMapWrapper } from '@/components/map/JobMapWrapper'
import { MapPin, Calendar, User2 } from 'lucide-react'

export default async function CleanerJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const user = await getUser()
  if (!user) redirect('/login')

  const job = await db.job.findUnique({
    where: { id },
    include: {
      customer: { select: { name: true } },
      bids: { where: { cleanerId: user.id } },
      _count: { select: { bids: true } },
    },
  })
  if (!job) notFound()

  const myBid = job.bids[0] ?? null
  const pool = POOL_TYPES[job.poolType as keyof typeof POOL_TYPES]
  const isAlreadyBid = myBid !== null

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-5">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span>{pool?.emoji}</span>
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {pool?.label}
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">{job.title}</h1>
          </div>
          <StatusBadge status={job.status as any} />
        </div>
        <p className="text-sm text-slate-600 mb-4 leading-relaxed">
          {job.description}
        </p>
        <div className="grid grid-cols-2 gap-3 text-sm text-slate-500 pt-4 border-t border-slate-50">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-slate-400 shrink-0" />
            <span className="truncate">{job.address}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-slate-400 shrink-0" />
            {fmtDate(job.preferredDate)}
          </div>
          <div className="flex items-center gap-2">
            <User2 size={14} className="text-slate-400 shrink-0" />
            {job.customer.name}
          </div>
          <div className="flex items-center gap-2">
            🏷️ {job._count.bids} bid{job._count.bids !== 1 ? 's' : ''} so far
          </div>
        </div>
      </div>

      <JobMapWrapper lat={job.lat} lng={job.lng} />

      {job.status === 'OPEN' && (
        isAlreadyBid ? (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700">
            ✓ You bid <strong>${myBid.price}</strong> on this job. Waiting for
            the customer to decide.
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
            <h2 className="font-semibold text-slate-900 mb-4">
              Place Your Bid
            </h2>
            <BidForm jobId={job.id} />
          </div>
        )
      )}
    </div>
  )
}
