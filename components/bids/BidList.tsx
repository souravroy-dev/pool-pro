'use client'

import { motion } from 'framer-motion'
import { BidCard } from './BidCard'
import type { BidWithCleaner } from '@/types'

export function BidList({
  bids,
  jobId,
  jobStatus,
  isOwner,
}: {
  bids: BidWithCleaner[]
  jobId: string
  jobStatus: string
  isOwner: boolean
}) {
  if (bids.length === 0) {
    return (
      <div className="py-10 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
        <p className="text-sm text-slate-400">
          No bids yet — cleaners will be notified shortly
        </p>
      </div>
    )
  }

  // Sort: accepted first, then by price
  const sorted = [...bids].sort((a, b) => {
    if (a.status === 'ACCEPTED') return -1
    if (b.status === 'ACCEPTED') return 1
    return a.price - b.price
  })

  return (
    <motion.div
      className="space-y-3"
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.07 } } }}
    >
      {sorted.map((bid, i) => (
        <motion.div
          key={bid.id}
          variants={{
            hidden: { opacity: 0, y: 12 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <BidCard
            bid={bid}
            isOwner={isOwner}
            jobStatus={jobStatus}
            isBest={i === 0 && bid.status === 'PENDING'}
          />
        </motion.div>
      ))}
    </motion.div>
  )
}
