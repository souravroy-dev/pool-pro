'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'
import { User } from 'lucide-react'

export default function CustomerProfilePage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [name, setName] = useState(session?.user?.name ?? '')
  const [loading, setLoading] = useState(false)

  async function save() {
    if (!name) return toast.error('Name is required')
    setLoading(true)
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    const json = await res.json()
    if (!json.ok) {
      toast.error(json.error.msg)
      setLoading(false)
      return
    }
    toast.success('Profile updated!')
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="p-6">
      <div className="max-w-lg">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your account settings
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-50">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
              {name[0]?.toUpperCase() ?? '?'}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{name}</p>
              <p className="text-sm text-slate-500">{session?.user?.email}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1.5">
                Display Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            <button
              onClick={save}
              disabled={loading || !name}
              className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-all"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
