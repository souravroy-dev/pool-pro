'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { cn, fmt$ } from '@/lib/utils'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import type { BidWithCleaner } from '@/types'

export function BidCard({
  bid,
  isOwner,
  jobStatus,
  isBest,
}: {
  bid: BidWithCleaner
  isOwner: boolean
  jobStatus: string
  isBest?: boolean
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const cp = bid.cleaner.cleanerProfile
  const stars = cp?.avgRating ?? 0

  async function accept() {
    if (!confirm('Accept this bid?')) return
    setLoading(true)
    const res = await fetch(`/api/bids/${bid.id}/accept`, {
      method: 'POST',
    })
    const json = await res.json()
    if (!json.ok) {
      toast.error(json.error.msg)
      setLoading(false)
      return
    }
    toast.success('Cleaner assigned!')
    router.refresh()
  }

  return (
    <div
      className={cn(
        'relative bg-white rounded-xl border shadow-card p-5 transition-all hover:shadow-card-hover',
        isBest ? 'border-amber-300 ring-1 ring-amber-200' : 'border-slate-100',
      )}
    >
      {isBest && (
        <span className="absolute -top-px -right-px bg-amber-400 text-white text-[10px] font-bold px-2.5 py-1 rounded-bl-xl rounded-tr-xl">
          ⭐ Best Match
        </span>
      )}

      {/* Cleaner info */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm shrink-0">
          {bid.cleaner.name[0]?.toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-slate-900 text-sm truncate">
            {bid.cleaner.name}
          </p>
          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star
                  key={i}
                  size={10}
                  className={cn(
                    i <= Math.round(stars)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-200',
                  )}
                />
              ))}
              <span className="text-xs text-slate-400 ml-1">
                {stars > 0 ? stars.toFixed(1) : 'New'}
              </span>
            </div>
            <span className="text-slate-300">·</span>
            <span className="text-xs text-slate-400">
              {cp?.totalJobsDone ?? 0} jobs
            </span>
            {cp?.experienceYears ? (
              <>
                <span className="text-slate-300">·</span>
                <span className="text-xs text-slate-400">
                  {cp.experienceYears}yr exp
                </span>
              </>
            ) : null}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-2xl font-bold text-blue-600 font-mono">
            {fmt$(bid.price)}
          </p>
          <p className="text-xs text-slate-400">{bid.durationHours}h est.</p>
        </div>
      </div>

      {/* Message */}
      <p className="text-sm text-slate-500 italic line-clamp-2 mb-4">
        &ldquo;{bid.message}&rdquo;
      </p>

      {/* Accept button */}
      {isOwner && jobStatus === 'OPEN' && (
        <button
          onClick={accept}
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-all"
        >
          {loading ? 'Accepting...' : 'Accept this Bid'}
        </button>
      )}
      {jobStatus === 'ASSIGNED' && bid.status === 'ACCEPTED' && (
        <div className="w-full py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-medium text-center border border-emerald-200">
          ✓ Accepted
        </div>
      )}
    </div>
  )
}
