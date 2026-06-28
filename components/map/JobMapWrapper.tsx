'use client'

import dynamic from 'next/dynamic'

const JobMapInner = dynamic(
  () => import('@/components/map/JobMap').then((m) => m.JobMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-44 bg-slate-100 rounded-xl animate-pulse" />
    ),
  },
)

export function JobMapWrapper({ lat, lng }: { lat: number; lng: number }) {
  return <JobMapInner lat={lat} lng={lng} />
}
