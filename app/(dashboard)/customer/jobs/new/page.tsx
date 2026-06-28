import { JobForm } from '@/components/jobs/JobForm'

export default function NewJobPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Post a Job</h1>
        <p className="text-slate-500 text-sm mt-1">
          Nearby cleaners will be able to bid on your job
        </p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
        <JobForm />
      </div>
    </div>
  )
}
