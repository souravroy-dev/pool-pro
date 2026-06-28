'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

export function ReviewSection({ jobId }: { jobId: string }) {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  if (done) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-700 text-center">
        ✅ Review submitted! Thank you.
      </div>
    )
  }

  async function submit() {
    if (!rating) return toast.error('Pick a star rating first')
    setLoading(true)
    const res = await fetch('/api/reviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, rating, comment: comment || undefined }),
    })
    const json = await res.json()
    if (!json.ok) {
      toast.error(json.error.msg)
      setLoading(false)
      return
    }
    setDone(true)
    router.refresh()
  }

  const labels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!']

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-card p-6">
      <h3 className="font-semibold text-slate-900 mb-4">
        How was the service?
      </h3>
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            onMouseEnter={() => setHovered(s)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => setRating(s)}
            className="transition-transform hover:scale-110"
          >
            <Star
              size={28}
              className={cn(
                'transition-colors',
                (hovered || rating) >= s
                  ? 'fill-amber-400 text-amber-400'
                  : 'text-slate-200',
              )}
            />
          </button>
        ))}
        {rating > 0 && (
          <span className="ml-2 text-sm text-slate-500 self-center font-medium">
            {labels[rating]}
          </span>
        )}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        rows={2}
        placeholder="Leave a comment (optional)"
        className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all mb-3"
      />
      <button
        onClick={submit}
        disabled={loading || !rating}
        className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-40 transition-all"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </button>
    </div>
  )
}
