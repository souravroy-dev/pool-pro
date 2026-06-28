import { notFound, redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { getUser } from '@/lib/auth-helpers'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { BidList } from '@/components/bids/BidList'
import { ReviewSection } from '@/components/reviews/ReviewSection'
import { POOL_TYPES } from '@/lib/constants'
import { fmtDate } from '@/lib/utils'
import { JobMapWrapper } from '@/components/map/JobMapWrapper'
import { MapPin, Calendar } from 'lucide-react'

export default async function CustomerJobPage({
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
                  bio: true,
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

  if (!job || job.customerId !== user.id) notFound()
  const pool = POOL_TYPES[job.poolType as keyof typeof POOL_TYPES]

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-5">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{pool?.emoji}</span>
              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {pool?.label}
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900">{job.title}</h1>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              {job.description}
            </p>
          </div>
          <StatusBadge status={job.status as any} />
        </div>

        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-50">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <MapPin size={14} className="text-slate-400 shrink-0" />
            <span className="truncate">{job.address}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Calendar size={14} className="text-slate-400 shrink-0" />
            {fmtDate(job.preferredDate)}
          </div>
        </div>
      </div>

      {/* Map */}
      <JobMapWrapper lat={job.lat} lng={job.lng} />

      {/* Bids */}
      {['OPEN', 'ASSIGNED'].includes(job.status) && (
        <div>
          <h2 className="text-base font-semibold text-slate-900 mb-3">
            {job.bids.length === 0
              ? 'Waiting for bids...'
              : `${job.bids.length} Bid${job.bids.length !== 1 ? 's' : ''} Received`}
          </h2>
          <BidList
            bids={job.bids as any}
            jobId={job.id}
            jobStatus={job.status}
            isOwner
          />
        </div>
      )}

      {/* Completed - Review */}
      {job.status === 'COMPLETED' && (
        <div id="review">
          {job.reviews.length > 0 ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-700 text-center">
              ✅ You already reviewed this job. Thank you!
              {job.reviews[0]?.comment && (
                <p className="mt-1 text-emerald-600 italic">
                  &ldquo;{job.reviews[0].comment}&rdquo;
                </p>
              )}
            </div>
          ) : (
            <ReviewSection jobId={job.id} />
          )}
        </div>
      )}
    </div>
  )
}
