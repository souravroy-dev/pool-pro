import type { User, Job, Bid, Review, CleanerProfile, CustomerProfile } from '@/prisma/client/client'

export type { User, Job, Bid, Review, CleanerProfile, CustomerProfile }

export type JobWithMeta = Job & {
  customer: Pick<User, 'id' | 'name'>
  _count: { bids: number }
}

export type BidWithCleaner = Bid & {
  cleaner: User & {
    cleanerProfile: Pick<CleanerProfile, 'avgRating' | 'totalJobsDone' | 'experienceYears'> | null
  }
}
