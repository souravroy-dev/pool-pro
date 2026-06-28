'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

export function BidForm({ jobId }: { jobId: string }) {
  const router = useRouter()
  const [price, setPrice] = useState('')
  const [hours, setHours] = useState('2')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit() {
    setLoading(true)
    const res = await fetch(`/api/jobs/${jobId}/bids`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        price: Number(price),
        durationHours: Number(hours),
        message,
      }),
    })
    const json = await res.json()
    if (!json.ok) {
      toast.error(json.error.msg)
      setLoading(false)
      return
    }
    toast.success('Bid submitted successfully!')
    router.refresh()
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1.5">
            Your Price ($)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0"
            min="10"
            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all font-mono"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1.5">
            Est. Hours
          </label>
          <select
            value={hours}
            onChange={(e) => setHours(e.target.value)}
            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          >
            {['1', '1.5', '2', '3', '4', '6', '8'].map((h) => (
              <option key={h} value={h}>
                {h}h
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-slate-500 uppercase tracking-wide block mb-1.5">
          Your Message
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="Tell the customer why you&apos;re the best choice..."
          className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
        />
        <p className="text-xs text-slate-400 mt-1">{message.length}/500</p>
      </div>
      <button
        onClick={submit}
        disabled={loading || !price || !message || message.length < 10}
        className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-40 transition-all"
      >
        {loading
          ? 'Submitting...'
          : `Submit Bid — $${price || '0'}`}
      </button>
    </div>
  )
}
