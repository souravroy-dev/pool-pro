'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { POOL_TYPES } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { MapPickerWrapper } from '@/components/map/MapPickerWrapper'

type Step = 1 | 2 | 3

export function JobForm() {
  const router = useRouter()
  const [step, setStep] = useState<Step>(1)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState({
    title: '',
    description: '',
    poolType: '' as keyof typeof POOL_TYPES | '',
    address: '',
    lat: 0,
    lng: 0,
    preferredDate: '',
  })

  function set<K extends keyof typeof data>(k: K, v: (typeof data)[K]) {
    setData((p) => ({ ...p, [k]: v }))
  }

  async function submit() {
    setLoading(true)
    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...data,
        preferredDate: new Date(data.preferredDate).toISOString(),
      }),
    })
    const json = await res.json()
    if (!json.ok) {
      toast.error(json.error.msg)
      setLoading(false)
      return
    }
    toast.success('Job posted successfully!')
    router.push(`/customer/jobs/${json.data.jobId}`)
  }

  const steps = ['Details', 'Location', 'Schedule']

  function canAdvance1() {
    return data.title && data.description && data.poolType
  }

  function canAdvance2() {
    return data.lat !== 0
  }

  return (
    <div className="max-w-xl">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => {
          const num = (i + 1) as Step
          const isPast = num < step
          const isCurrent = num === step
          return (
            <div key={s} className="flex items-center gap-2">
              <div
                className={cn(
                  'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all',
                  isPast
                    ? 'bg-emerald-500 text-white'
                    : isCurrent
                      ? 'bg-blue-600 text-white ring-2 ring-blue-200'
                      : 'bg-slate-100 text-slate-400',
                )}
              >
                {isPast ? '✓' : num}
              </div>
              <span
                className={cn(
                  'text-sm hidden sm:inline',
                  isCurrent
                    ? 'text-slate-800 font-medium'
                    : 'text-slate-400',
                )}
              >
                {s}
              </span>
              {i < steps.length - 1 && (
                <div
                  className={cn(
                    'w-8 h-px hidden sm:block',
                    isPast ? 'bg-emerald-300' : 'bg-slate-200',
                  )}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Step 1 — Details */}
      {step === 1 && (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5 block">
              Pool Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(
                Object.entries(POOL_TYPES) as [
                  keyof typeof POOL_TYPES,
                  (typeof POOL_TYPES)[keyof typeof POOL_TYPES],
                ][]
              ).map(([k, v]) => (
                <button
                  key={k}
                  onClick={() => set('poolType', k)}
                  className={cn(
                    'flex items-center gap-2 p-3 rounded-xl border-2 text-sm transition-all',
                    data.poolType === k
                      ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50',
                  )}
                >
                  <span>{v.emoji}</span>
                  {v.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5 block">
              Job Title
            </label>
            <input
              value={data.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. Weekly pool cleaning"
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5 block">
              Description
            </label>
            <textarea
              value={data.description}
              onChange={(e) => set('description', e.target.value)}
              rows={3}
              placeholder="Describe any special requirements or details about your pool..."
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
            />
            <p className="text-xs text-slate-400 mt-1">
              {data.description.length}/1000
            </p>
          </div>
          <button
            onClick={() => canAdvance1() && setStep(2)}
            disabled={!canAdvance1()}
            className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-40 transition-all"
          >
            Next: Location →
          </button>
        </div>
      )}

      {/* Step 2 — Location */}
      {step === 2 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">
            Set the location of your pool on the map
          </p>
          <MapPickerWrapper
            lat={data.lat || undefined}
            lng={data.lng || undefined}
            onChange={(lat, lng, address) =>
              setData((p) => ({ ...p, lat, lng, address }))
            }
          />
          {data.address && (
            <div className="flex items-start gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-blue-500 mt-0.5">📍</span>
              <p className="text-sm text-slate-700">{data.address}</p>
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm hover:bg-slate-50 transition-all"
            >
              ← Back
            </button>
            <button
              onClick={() => canAdvance2() && setStep(3)}
              disabled={!canAdvance2()}
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-40 transition-all"
            >
              Next: Schedule →
            </button>
          </div>
        </div>
      )}

      {/* Step 3 — Schedule */}
      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5 block">
              Preferred Date
            </label>
            <input
              type="datetime-local"
              value={data.preferredDate}
              onChange={(e) => set('preferredDate', e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Summary */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-sm">
            <p className="font-medium text-slate-800 mb-3">📋 Job Summary</p>
            {(
              [
                ['Type', POOL_TYPES[data.poolType as keyof typeof POOL_TYPES]?.label],
                ['Title', data.title],
                ['Location', data.address],
                [
                  'Date',
                  data.preferredDate
                    ? new Date(data.preferredDate).toLocaleString()
                    : '',
                ],
              ] as [string, string][]
            ).map(
              ([k, v]) =>
                v && (
                  <div key={k} className="flex gap-2">
                    <span className="text-slate-400 w-16 shrink-0">{k}</span>
                    <span className="text-slate-700">{v}</span>
                  </div>
                ),
            )}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setStep(2)}
              className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm hover:bg-slate-50 transition-all"
            >
              ← Back
            </button>
            <button
              onClick={submit}
              disabled={loading || !data.preferredDate}
              className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-40 transition-all"
            >
              {loading ? 'Posting...' : 'Post Job 🚀'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
