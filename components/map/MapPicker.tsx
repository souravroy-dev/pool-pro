'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { ensureLeafletIcons } from '@/lib/leaflet-setup'

ensureLeafletIcons()

interface MapPickerProps {
  lat?: number
  lng?: number
  onChange: (lat: number, lng: number, address: string) => void
}

const DEFAULT_CENTER: [number, number] = [25.76, -80.19] // Miami

export function MapPicker({ lat, lng, onChange }: MapPickerProps) {
  const container = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const reverseGeocode = useCallback(
    async (latN: number, lngN: number) => {
      try {
        const r = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latN}&lon=${lngN}&format=json&addressdetails=1`,
          { headers: { 'Accept-Language': 'en' } },
        )
        const d = await r.json()
        onChange(latN, lngN, d.display_name ?? `${latN.toFixed(4)}, ${lngN.toFixed(4)}`)
      } catch {
        onChange(latN, lngN, `${latN.toFixed(4)}, ${lngN.toFixed(4)}`)
      }
    },
    [onChange],
  )

  const searchLocation = useCallback(async () => {
    if (!searchQuery.trim()) return
    try {
      const r = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=1`,
        { headers: { 'Accept-Language': 'en' } },
      )
      const results = await r.json()
      if (results.length > 0) {
        const { lat: sLat, lon: sLon, display_name } = results[0]
        const newLat = parseFloat(sLat)
        const newLng = parseFloat(sLon)
        markerRef.current?.setLatLng([newLat, newLng])
        mapRef.current?.flyTo([newLat, newLng], 14)
        onChange(newLat, newLng, display_name)
      }
    } catch {
      // silently fail
    }
  }, [searchQuery, onChange])

  useEffect(() => {
    if (!container.current || mapRef.current) return

    const center: [number, number] = lat && lng ? [lat, lng] : DEFAULT_CENTER

    mapRef.current = L.map(container.current, {
      center,
      zoom: lat && lng ? 13 : 10,
      zoomControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(mapRef.current)

    // Draggable marker
    markerRef.current = L.marker(center, { draggable: true }).addTo(mapRef.current)

    markerRef.current.on('dragend', () => {
      const p = markerRef.current!.getLatLng()
      reverseGeocode(p.lat, p.lng)
    })

    mapRef.current.on('click', (e: L.LeafletMouseEvent) => {
      markerRef.current?.setLatLng(e.latlng)
      reverseGeocode(e.latlng.lat, e.latlng.lng)
    })

    return () => {
      mapRef.current?.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      searchLocation()
    }
  }

  return (
    <div className="space-y-2">
      {/* Search input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search address or place..."
          className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
        <button
          type="button"
          onClick={searchLocation}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all"
        >
          Search
        </button>
      </div>
      {/* Map */}
      <div ref={container} className="h-64 rounded-xl overflow-hidden border border-slate-200 z-0" />
      <p className="text-xs text-slate-400">
        Click map or drag pin to set location
      </p>
    </div>
  )
}
