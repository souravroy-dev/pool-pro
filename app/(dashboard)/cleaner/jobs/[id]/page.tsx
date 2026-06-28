import { db } from '@/lib/db'
import { getUser } from '@/lib/auth-helpers'
import { notFound, redirect } from 'next/navigation'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { StatusAdvanceButton } from '@/components/jobs/StatusAdvanceButton'
import { POOL_TYPES } from '@/lib/constants'
import { fmtDate } from '@/lib/utils'
import { MapPin, Calendar, DollarSign } from 'lucide-react'

export default async function CleanerJobActivePage({
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
      bids: { where: { status: 'ACCEPTED' } },
    },
  })

  if (!job || job.cleanerId !== user.id) notFound()
  const pool = POOL_TYPES[job.poolType as keyof typeof POOL_TYPES]
  const bid = job.bids[0]

  return (
    <div className="max-w-lg mx-auto p-6 space-y-4">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-xl mb-1 block">{pool?.emoji}</span>
            <h1 className="text-xl font-bold text-slate-900">{job.title}</h1>
            <p className="text-sm text-slate-500 mt-1">
              Customer: {job.customer.name}
            </p>
          </div>
          <StatusBadge status={job.status as any} />
        </div>

        <div className="space-y-2 text-sm text-slate-500 pt-4 border-t border-slate-50">
          <div className="flex items-center gap-2">
            <MapPin size={14} className="text-slate-400 shrink-0" />
            {job.address}
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-slate-400 shrink-0" />
            {fmtDate(job.preferredDate)}
          </div>
          {bid && (
            <div className="flex items-center gap-2">
              <DollarSign size={14} className="text-slate-400 shrink-0" />
              Your price:{' '}
              <strong className="text-slate-800 font-mono">
                ${bid.price}
              </strong>
            </div>
          )}
        </div>
      </div>

      {/* Status progression */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
        <h2 className="font-semibold text-slate-900 mb-4">Job Progress</h2>

        <div className="space-y-3 mb-6">
          {[
            {
              key: 'ASSIGNED',
              label: 'Job Assigned',
              desc: 'You got the job!',
            },
            { key: 'IN_PROGRESS', label: 'In Progress', desc: 'Cleaning started' },
            { key: 'COMPLETED', label: 'Completed', desc: 'Job done!' },
          ].map(({ key, label, desc }) => {
            const order = ['ASSIGNED', 'IN_PROGRESS', 'COMPLETED']
            const jobIdx = order.indexOf(job.status)
            const stepIdx = order.indexOf(key)
            const done = stepIdx < jobIdx
            const active = stepIdx === jobIdx
            return (
              <div key={key} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                    done
                      ? 'bg-emerald-100 text-emerald-600'
                      : active
                        ? 'bg-blue-100 text-blue-600 ring-2 ring-blue-200'
                        : 'bg-slate-100 text-slate-300'
                  }`}
                >
                  {done ? '✓' : stepIdx + 1}
                </div>
                <div>
                  <p
                    className={`text-sm font-medium ${
                      active
                        ? 'text-slate-900'
                        : done
                          ? 'text-emerald-700'
                          : 'text-slate-400'
                    }`}
                  >
                    {label}
                  </p>
                  {active && (
                    <p className="text-xs text-slate-500">{desc}</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {['ASSIGNED', 'IN_PROGRESS'].includes(job.status) && (
          <StatusAdvanceButton
            jobId={job.id}
            currentStatus={job.status}
          />
        )}

        {job.status === 'COMPLETED' && (
          <div className="w-full py-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium text-center border border-emerald-200">
            🎉 Job Complete! Payment will be processed.
          </div>
        )}
      </div>
    </div>
  )
}
