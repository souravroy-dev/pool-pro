'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { useSession } from 'next-auth/react'

interface SaveJobButtonProps {
  jobId: string
  initialSaved: boolean
}

export function SaveJobButton({ jobId, initialSaved }: SaveJobButtonProps) {
  const { data: session } = useSession()
  const [saved, setSaved] = useState(initialSaved)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    if (!session?.user) return
    setLoading(true)

    // Optimistic update
    setSaved((prev) => !prev)

    try {
      if (saved) {
        const res = await fetch(`/api/saved-jobs?jobId=${jobId}`, {
          method: 'DELETE',
        })
        const json = await res.json()
        if (!json.ok) {
          // Revert on failure
          setSaved((prev) => !prev)
          toast.error(json.error?.msg ?? 'Failed to unsave')
        }
      } else {
        const res = await fetch('/api/saved-jobs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobId }),
        })
        const json = await res.json()
        if (!json.ok) {
          setSaved((prev) => !prev)
          toast.error(json.error?.msg ?? 'Failed to save')
        }
      }
    } catch {
      setSaved((prev) => !prev)
      toast.error('Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle()
      }}
      disabled={loading}
      className={cn(
        'flex items-center justify-center w-8 h-8 rounded-full transition-all',
        saved
          ? 'bg-red-50 hover:bg-red-100'
          : 'bg-white/80 backdrop-blur-sm hover:bg-white border border-slate-200 shadow-sm',
      )}
      title={saved ? 'Unsave job' : 'Save job'}
    >
      <Heart
        size={14}
        className={cn(
          'transition-all',
          saved
            ? 'fill-red-500 text-red-500 scale-110'
            : 'text-slate-400 hover:text-red-400',
          loading && 'animate-pulse',
        )}
      />
    </button>
  )
}
