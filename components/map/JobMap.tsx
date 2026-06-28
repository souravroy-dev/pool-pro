'use client'

import { useRef, useEffect } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { ensureLeafletIcons } from '@/lib/leaflet-setup'

ensureLeafletIcons()

export function JobMap({ lat, lng }: { lat: number; lng: number }) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!container.current) return

    const map = L.map(container.current, {
      center: [lat, lng],
      zoom: 13,
      zoomControl: false,
      dragging: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      touchZoom: false,
      keyboard: false,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    L.marker([lat, lng]).addTo(map)

    return () => { map.remove() }
  }, [lat, lng])

  return (
    <div className="h-44 rounded-xl overflow-hidden border border-slate-200 z-0" />
  )
}
