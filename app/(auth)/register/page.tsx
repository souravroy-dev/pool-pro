'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default function RegisterPage() {
  const router = useRouter()
  const [role, setRole] = useState<'CUSTOMER' | 'CLEANER' | null>(null)
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  async function submit() {
    setLoading(true)
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, role }),
    })
    const json = await res.json()
    if (!json.ok) {
      toast.error(json.error.msg)
      setLoading(false)
      return
    }

    const result = await signIn('credentials', {
      email: form.email,
      password: form.password,
      redirect: false,
    })

    if (result?.ok) {
      router.push(role === 'CUSTOMER' ? '/customer/jobs' : '/cleaner/discover')
    }
    setLoading(false)
  }

  if (step === 1) {
    return (
      <div>
        <h1 className="text-xl font-bold text-slate-900 mb-1">Join PoolPro</h1>
        <p className="text-sm text-slate-500 mb-6">Who are you?</p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {(
            [
              ['CUSTOMER', '🏊', 'I need a pool cleaned'],
              ['CLEANER', '🧹', 'I clean pools'],
            ] as const
          ).map(([r, emoji, label]) => (
            <button
              key={r}
              onClick={() => setRole(r)}
              className={cn(
                'p-4 rounded-xl border-2 text-left transition-all',
                role === r
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50',
              )}
            >
              <div className="text-2xl mb-2">{emoji}</div>
              <p className="text-sm font-medium text-slate-800">{label}</p>
            </button>
          ))}
        </div>
        <button
          onClick={() => role && setStep(2)}
          disabled={!role}
          className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium disabled:opacity-40 hover:bg-blue-700 transition-all"
        >
          Continue →
        </button>
        <p className="text-center text-xs text-slate-400 mt-4">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign in
          </Link>
        </p>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={() => setStep(1)}
        className="text-sm text-slate-400 mb-4 hover:text-slate-600 transition-colors flex items-center gap-1"
      >
        ← Back
      </button>
      <h1 className="text-xl font-bold text-slate-900 mb-6">Create account</h1>
      <div className="space-y-3">
        {(['name', 'email', 'password'] as const).map((f) => (
          <input
            key={f}
            type={f === 'password' ? 'password' : f === 'email' ? 'email' : 'text'}
            placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
            value={form[f]}
            onChange={(e) => setForm((p) => ({ ...p, [f]: e.target.value }))}
            className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
          />
        ))}
        <button
          onClick={submit}
          disabled={loading || !form.name || !form.email || !form.password}
          className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium disabled:opacity-40 hover:bg-blue-700 transition-all"
        >
          {loading ? 'Creating...' : 'Create account'}
        </button>
      </div>
    </div>
  )
}
