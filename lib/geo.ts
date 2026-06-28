import { db } from './db'

export function distKm(lat1: number, lng1: number, lat2: number, lng2: number) {
  const R = 6371
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export async function nearbyCleaners(lat: number, lng: number) {
  const all = await db.cleanerProfile.findMany({
    where: { lat: { not: null }, lng: { not: null } },
    select: { userId: true, lat: true, lng: true, serviceRadiusKm: true },
  })
  return all.filter(c => distKm(lat, lng, c.lat!, c.lng!) <= c.serviceRadiusKm)
}
