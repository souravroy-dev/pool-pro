import { db } from '@/lib/db'
import { getUser } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'
import { JobCard } from '@/components/jobs/JobCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { Briefcase } from 'lucide-react'

export default async function CleanerJobsPage() {
  const user = await getUser()
  if (!user) redirect('/login')

  const jobs = await db.job.findMany({
    where: { cleanerId: user.id },
    include: { _count: { select: { bids: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">My Jobs</h1>
        <p className="text-slate-500 text-sm mt-1">
          {jobs.length} job{jobs.length !== 1 ? 's' : ''}
        </p>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs yet"
          desc="Browse available jobs and place your bids to get started."
          action={{
            label: 'Discover Jobs',
            href: '/cleaner/discover',
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job as any}
              href={`/cleaner/jobs/${job.id}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
