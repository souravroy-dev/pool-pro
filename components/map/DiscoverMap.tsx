'use client'

import { useRef, useEffect, useMemo } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { ensureLeafletIcons } from '@/lib/leaflet-setup'
import { POOL_TYPES } from '@/lib/constants'

ensureLeafletIcons()

interface JobMarker {
  id: string
  title: string
  lat: number
  lng: number
  poolType: keyof typeof POOL_TYPES
  distKm: number
  bidCount: number
}

interface DiscoverMapProps {
  jobs: JobMarker[]
  savedJobIds: string[]
  cleanerLat: number
  cleanerLng: number
  serviceRadiusKm: number
  onJobClick?: (jobId: string) => void
}

export function DiscoverMap({
  jobs,
  savedJobIds,
  cleanerLat,
  cleanerLng,
  serviceRadiusKm,
  onJobClick,
}: DiscoverMapProps) {
  const container = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)

  const savedSet = useMemo(() => new Set(savedJobIds), [savedJobIds])

  useEffect(() => {
    if (!container.current || mapRef.current) return

    const map = L.map(container.current, {
      center: [cleanerLat, cleanerLng],
      zoom: 11,
      zoomControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    // Service radius circle
    L.circle([cleanerLat, cleanerLng], {
      radius: serviceRadiusKm * 1000,
      color: '#3b82f6',
      fillColor: '#3b82f6',
      fillOpacity: 0.06,
      weight: 2,
      dashArray: '6 4',
    }).addTo(map)

    // Cleaner position marker (blue dot)
    const cleanerIcon = L.divIcon({
      className: '',
      html: `<div style="width:16px;height:16px;background:#3b82f6;border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.2);"></div>`,
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    })
    L.marker([cleanerLat, cleanerLng], {
      icon: cleanerIcon,
      zIndexOffset: 1000,
    })
      .addTo(map)
      .bindPopup(
        `<div style="font-size:13px;font-weight:600;color:#0f172a;">Your Location</div>`,
      )

    // Job marker factory
    function createJobIcon(isSaved: boolean) {
      const bgColor = isSaved ? '#e11d48' : '#2563eb'
      const emoji = isSaved ? '❤️' : '🏊'
      return L.divIcon({
        className: '',
        html: `<div style="width:34px;height:34px;background:${bgColor};border:3px solid white;border-radius:50%;box-shadow:0 2px 8px rgba(0,0,0,0.15);display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;cursor:pointer;transition:transform 0.2s;">${emoji}</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      })
    }

    jobs.forEach((job) => {
      const isSaved = savedSet.has(job.id)
      const pool = POOL_TYPES[job.poolType]
      const emoji = pool?.emoji ?? '🏊'
      const poolLabel = pool?.label ?? 'Pool'

      const marker = L.marker([job.lat, job.lng], {
        icon: createJobIcon(isSaved),
      }).addTo(map)

      const popupHtml = `
        <div style="font-family:system-ui,sans-serif;min-width:200px;">
          <div style="display:flex;align-items:center;gap:6px;margin-bottom:6px;">
            <span style="font-size:18px;">${emoji}</span>
            <span style="font-size:11px;color:#64748b;background:#f1f5f9;padding:1px 6px;border-radius:4px;">${poolLabel}</span>
            ${
              isSaved
                ? '<span style="font-size:11px;color:#e11d48;background:#fef2f2;padding:1px 6px;border-radius:4px;margin-left:auto;">❤️ Saved</span>'
                : ''
            }
          </div>
          <div style="font-size:14px;font-weight:600;color:#0f172a;margin-bottom:4px;line-height:1.3;">
            ${job.title}
          </div>
          <div style="font-size:12px;color:#64748b;display:flex;align-items:center;gap:4px;margin-bottom:6px;">
            📍 ${job.distKm.toFixed(1)} km
            <span style="margin:0 4px;">·</span>
            💬 ${job.bidCount} bid${job.bidCount !== 1 ? 's' : ''}
          </div>
          <a href="/cleaner/discover/${job.id}" style="display:inline-block;padding:5px 14px;background:#2563eb;color:white;border-radius:8px;font-size:12px;font-weight:600;text-decoration:none;margin-top:2px;">
            View Details →
          </a>
        </div>
      `

      marker.bindPopup(popupHtml, {
        closeButton: true,
        maxWidth: 260,
        className: 'custom-popup',
      })

      // Zoom to job on click, then open popup
      marker.on('click', () => {
        map.flyTo([job.lat, job.lng], 15, { duration: 0.6 })
        setTimeout(() => {
          marker.openPopup()
        }, 650)
        if (onJobClick) onJobClick(job.id)
      })
    })

    // Fit bounds to show all jobs + cleaner location
    const allPoints: [number, number][] = [
      [cleanerLat, cleanerLng],
      ...jobs.map((j) => [j.lat, j.lng] as [number, number]),
    ]
    const bounds = L.latLngBounds(allPoints)
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 })

    return () => {
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      ref={container}
      className="h-[500px] rounded-2xl overflow-hidden border border-slate-200 shadow-card z-0"
    />
  )
}
