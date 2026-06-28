'use client'

import dynamic from 'next/dynamic'

const MapPickerInner = dynamic(
  () => import('@/components/map/MapPicker').then((m) => m.MapPicker),
  {
    ssr: false,
    loading: () => (
      <div className="h-64 bg-slate-100 rounded-xl animate-pulse" />
    ),
  },
)

interface MapPickerWrapperProps {
  lat?: number
  lng?: number
  onChange: (lat: number, lng: number, address: string) => void
}

export function MapPickerWrapper({
  lat,
  lng,
  onChange,
}: MapPickerWrapperProps) {
  return <MapPickerInner lat={lat} lng={lng} onChange={onChange} />
}
