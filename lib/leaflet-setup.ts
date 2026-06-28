import L from 'leaflet'

let initialized = false

export function ensureLeafletIcons() {
  if (initialized) return
  initialized = true

  // Fix default marker icon for bundlers (Turbopack/Webpack) — use CDN URLs
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl:
      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl:
      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })
}
