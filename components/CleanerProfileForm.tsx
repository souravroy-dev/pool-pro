'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import type { CleanerProfile } from '@/prisma/client'
import { MapPickerWrapper } from '@/components/map/MapPickerWrapper'

export function CleanerProfileForm({
  profile,
  name: initialName,
}: {
  profile: CleanerProfile | null
  name: string
}) {
  const router = useRouter()
  const [name, setName] = useState(initialName)
  const [bio, setBio] = useState(profile?.bio ?? '')
  const [years, setYears] = useState(String(profile?.experienceYears ?? 0))
  const [radius, setRadius] = useState(
    String(profile?.serviceRadiusKm ?? 25),
  )
  const [lat, setLat] = useState(profile?.lat ?? 0)
  const [lng, setLng] = useState(profile?.lng ?? 0)
  const [loading, setLoading] = useState(false)

  async function save() {
    if (!lat || !lng) {
      toast.error('Please set your location on the map')
      return
    }
    setLoading(true)
    const res = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        bio,
        experienceYears: Number(years),
        serviceRadiusKm: Number(radius),
        lat,
        lng,
      }),
    })
    const json = await res.json()
    if (!json.ok) {
      toast.error(json.error.msg)
      setLoading(false)
      return
    }
    toast.success('Profile saved!')
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1.5">
          Your Name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
      </div>
      <div>
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1.5">
          Bio
        </label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={2}
          placeholder="Tell customers about yourself..."
          className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1.5">
            Experience (years)
          </label>
          <input
            type="number"
            value={years}
            onChange={(e) => setYears(e.target.value)}
            min="0"
            max="50"
            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1.5">
            Service Radius (km)
          </label>
          <input
            type="number"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            min="1"
            max="200"
            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1.5">
          Your Location
        </label>
        <MapPickerWrapper
          lat={lat || undefined}
          lng={lng || undefined}
          onChange={(la, ln) => {
            setLat(la)
            setLng(ln)
          }}
        />
      </div>
      <button
        onClick={save}
        disabled={loading}
        className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-all"
      >
        {loading ? 'Saving...' : 'Save Profile'}
      </button>
    </div>
  )
}
