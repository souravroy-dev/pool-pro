import Link from 'next/link'
import { MapPin, Calendar, Users } from 'lucide-react'
import { StatusBadge } from '@/components/shared/StatusBadge'
import { POOL_TYPES } from '@/lib/constants'
import { fmtDate, cn } from '@/lib/utils'
import type { JobWithMeta } from '@/types'

const STATUS_BORDER: Record<string, string> = {
  OPEN: 'border-l-blue-500',
  ASSIGNED: 'border-l-amber-500',
  IN_PROGRESS: 'border-l-violet-500',
  COMPLETED: 'border-l-emerald-500',
  CANCELLED: 'border-l-slate-300',
}

export function JobCard({ job, href }: { job: JobWithMeta; href: string }) {
  const pool = POOL_TYPES[job.poolType as keyof typeof POOL_TYPES]

  return (
    <Link
      href={href}
      className={cn(
        'block bg-white rounded-xl border-l-4 border border-slate-100 shadow-card hover:shadow-card-hover transition-all duration-200 p-5 group',
        STATUS_BORDER[job.status as keyof typeof STATUS_BORDER],
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <span className="text-2xl">{pool?.emoji}</span>
        <StatusBadge status={job.status as any} />
      </div>
      <h3 className="font-semibold text-slate-900 text-sm leading-snug mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
        {job.title}
      </h3>
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <MapPin size={11} className="shrink-0" />
          <span className="truncate">{job.address}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-500">
          <Calendar size={11} />
          {fmtDate(job.preferredDate)}
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between">
        <span className="text-xs text-slate-400">{pool?.label}</span>
        <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded-full">
          <Users size={10} />
          {job._count?.bids ?? 0} bid{job._count?.bids !== 1 ? 's' : ''}
        </div>
      </div>
    </Link>
  )
}
