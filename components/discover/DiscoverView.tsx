'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import { Grid3X3, Map as MapIcon, Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { JobCard } from '@/components/jobs/JobCard'
import { SaveJobButton } from '@/components/jobs/SaveJobButton'
import { EmptyState } from '@/components/shared/EmptyState'
import { Search, MapPin } from 'lucide-react'
import type { POOL_TYPES } from '@/lib/constants'

const DiscoverMap = dynamic(
  () => import('@/components/map/DiscoverMap').then((m) => m.DiscoverMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[500px] bg-slate-100 rounded-2xl animate-pulse border border-slate-200" />
    ),
  },
)

type ViewMode = 'grid' | 'map'

interface JobItem {
  id: string
  title: string
  lat: number
  lng: number
  poolType: keyof typeof POOL_TYPES
  distKm: number
  bidCount: number
  // Pass through for JobCard
  [key: string]: unknown
}

interface DiscoverViewProps {
  jobs: JobItem[]
  savedJobIds: string[]
  cleanerLat: number
  cleanerLng: number
  serviceRadiusKm: number
  count: number
  defaultTab?: string
}

export function DiscoverView({
  jobs,
  savedJobIds,
  cleanerLat,
  cleanerLng,
  serviceRadiusKm,
  count,
  defaultTab,
}: DiscoverViewProps) {
  const [view, setView] = useState<ViewMode>('grid')
  const [showSavedOnly, setShowSavedOnly] = useState(defaultTab === 'saved')

  const savedSet = useMemo(() => new Set(savedJobIds), [savedJobIds])

  const displayedJobs = useMemo(
    () =>
      showSavedOnly
        ? jobs.filter((j) => savedSet.has(j.id))
        : jobs,
    [jobs, showSavedOnly, savedSet],
  )

  const savedCount = useMemo(
    () => jobs.filter((j) => savedSet.has(j.id)).length,
    [jobs, savedSet],
  )

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Discover Jobs
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              {showSavedOnly
                ? `${displayedJobs.length} saved job${displayedJobs.length !== 1 ? 's' : ''}`
                : `${count} job${count !== 1 ? 's' : ''} within ${serviceRadiusKm}km of you`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Saved filter toggle */}
            <button
              type="button"
              onClick={() => setShowSavedOnly(!showSavedOnly)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                showSavedOnly
                  ? 'bg-red-50 text-red-600 border border-red-200'
                  : 'text-slate-500 hover:text-slate-700 bg-slate-100',
              )}
            >
              <Heart
                size={14}
                className={showSavedOnly ? 'fill-red-500 text-red-500' : ''}
              />
              Saved
              {savedCount > 0 && (
                <span
                  className={cn(
                    'text-xs px-1.5 py-0.5 rounded-full',
                    showSavedOnly
                      ? 'bg-red-100 text-red-600'
                      : 'bg-slate-200 text-slate-600',
                  )}
                >
                  {savedCount}
                </span>
              )}
            </button>

            {/* View toggle */}
            <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setView('grid')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  view === 'grid'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700',
                )}
              >
                <Grid3X3 size={15} />
                Grid
              </button>
              <button
                type="button"
                onClick={() => setView('map')}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all',
                  view === 'map'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700',
                )}
              >
                <MapIcon size={15} />
                Map
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      {displayedJobs.length === 0 ? (
        <EmptyState
          icon={showSavedOnly ? Heart : Search}
          title={showSavedOnly ? 'No saved jobs' : 'No jobs nearby'}
          desc={
            showSavedOnly
              ? 'Tap the heart icon on any job to save it for later.'
              : 'Try increasing your service radius in your profile.'
          }
          action={
            showSavedOnly
              ? { label: 'Browse All Jobs', href: '/cleaner/discover' }
              : { label: 'Edit Profile', href: '/cleaner/profile' }
          }
        />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {displayedJobs.map((j) => (
            <div key={j.id} className="relative group">
              <span className="absolute top-3 left-3 z-10 flex items-center gap-1 text-xs bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-full text-slate-500 border border-slate-200 shadow-card">
                <MapPin size={10} />
                {j.distKm.toFixed(1)} km
              </span>
              <div className="absolute top-3 right-3 z-10">
                <SaveJobButton
                  jobId={j.id}
                  initialSaved={savedSet.has(j.id)}
                />
              </div>
              <JobCard
                job={j as any}
                href={`/cleaner/discover/${j.id}`}
              />
            </div>
          ))}
        </div>
      ) : (
        <DiscoverMap
          jobs={displayedJobs.map((j) => ({
            id: j.id,
            title: j.title,
            lat: j.lat,
            lng: j.lng,
            poolType: j.poolType,
            distKm: j.distKm,
            bidCount: j.bidCount,
          }))}
          savedJobIds={savedJobIds}
          cleanerLat={cleanerLat}
          cleanerLng={cleanerLng}
          serviceRadiusKm={serviceRadiusKm}
        />
      )}
    </div>
  )
}
