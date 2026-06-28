import { db } from '@/lib/db'
import { getUser } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'
import { EmptyState } from '@/components/shared/EmptyState'
import { Search } from 'lucide-react'
import { distKm } from '@/lib/geo'
import { DiscoverView } from '@/components/discover/DiscoverView'

export default async function DiscoverPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>
}) {
  const { tab } = await searchParams
  const user = await getUser()
  if (!user) redirect('/login')

  const profile = user.cleanerProfile
  if (!profile?.lat || !profile?.lng) {
    return (
      <div className="p-6">
        <EmptyState
          icon={Search}
          title="Set your service area"
          desc="Go to your profile and set your location so you can see nearby jobs."
          action={{ label: 'Update Profile', href: '/cleaner/profile' }}
        />
      </div>
    )
  }

  const all = await db.job.findMany({
    where: { status: 'OPEN' },
    include: {
      customer: { select: { id: true, name: true } },
      _count: { select: { bids: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  const nearby = all
    .filter(
      (j) =>
        distKm(profile.lat!, profile.lng!, j.lat, j.lng) <=
        profile.serviceRadiusKm,
    )
    .map((j) => ({
      ...j,
      distKm: distKm(profile.lat!, profile.lng!, j.lat, j.lng),
    }))
    .sort((a, b) => a.distKm - b.distKm)

  // If no jobs, show inline empty state (not inside DiscoverView)
  if (nearby.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          icon={Search}
          title="No jobs nearby"
          desc="Try increasing your service radius in your profile."
          action={{ label: 'Edit Profile', href: '/cleaner/profile' }}
        />
      </div>
    )
  }

  // Fetch saved job IDs for this cleaner
  const savedRows = await db.savedJob.findMany({
    where: { cleanerId: user.id },
    select: { jobId: true },
  })
  const savedJobIds = savedRows.map((s) => s.jobId)

  return (
    <DiscoverView
      jobs={nearby.map((j) => ({
        ...j,
        bidCount: j._count.bids,
      }))}
      savedJobIds={savedJobIds}
      cleanerLat={profile.lat}
      cleanerLng={profile.lng}
      serviceRadiusKm={profile.serviceRadiusKm}
      count={nearby.length}
      defaultTab={tab}
    />
  )
}
