'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const NEXT: Record<string, { status: string; label: string }> = {
  ASSIGNED: { status: 'IN_PROGRESS', label: '🧹 Start Cleaning' },
  IN_PROGRESS: { status: 'COMPLETED', label: '✅ Mark as Complete' },
}

export function StatusAdvanceButton({
  jobId,
  currentStatus,
}: {
  jobId: string
  currentStatus: string
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const next = NEXT[currentStatus]
  if (!next) return null

  async function advance() {
    if (!confirm(`Mark job as "${next.status.replace('_', ' ')}"?`)) return
    setLoading(true)
    const res = await fetch(`/api/jobs/${jobId}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: next.status }),
    })
    const json = await res.json()
    if (!json.ok) {
      toast.error(json.error.msg)
      setLoading(false)
      return
    }
    toast.success('Status updated!')
    router.refresh()
  }

  return (
    <button
      onClick={advance}
      disabled={loading}
      className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition-all"
    >
      {loading ? 'Updating...' : next.label}
    </button>
  )
}
