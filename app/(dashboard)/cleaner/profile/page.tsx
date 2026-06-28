import { getUser } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'
import { CleanerProfileForm } from '@/components/CleanerProfileForm'

export default async function CleanerProfilePage() {
  const user = await getUser()
  if (!user) redirect('/login')

  return (
    <div className="p-6">
      <div className="max-w-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Your Profile</h1>
          <p className="text-slate-500 text-sm mt-1">
            Set your service area to receive nearby job notifications
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
          <CleanerProfileForm
            profile={user.cleanerProfile}
            name={user.name}
          />
        </div>
      </div>
    </div>
  )
}
