import Link from 'next/link'
import { db } from '@/lib/db'
import { getUser } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'
import { JobCard } from '@/components/jobs/JobCard'
import { EmptyState } from '@/components/shared/EmptyState'
import { Plus, Briefcase } from 'lucide-react'

export default async function MyJobsPage() {
  const user = await getUser()
  if (!user) redirect('/login')

  const jobs = await db.job.findMany({
    where: { customerId: user.id },
    include: { _count: { select: { bids: true } } },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">My Jobs</h1>
          <p className="text-slate-500 text-sm mt-1">
            {jobs.length} job{jobs.length !== 1 ? 's' : ''} posted
          </p>
        </div>
        <Link
          href="/customer/jobs/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
        >
          <Plus size={16} />
          Post a Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No jobs yet"
          desc="Post your first job and get competitive bids from nearby cleaners."
          action={{ label: 'Post a Job', href: '/customer/jobs/new' }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job as any}
              href={`/customer/jobs/${job.id}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
