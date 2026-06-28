'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function login() {
    setLoading(true)
    const res = await signIn('credentials', { email, password, redirect: false })
    if (!res?.ok) {
      toast.error('Invalid email or password')
      setLoading(false)
      return
    }

    // Determine role from session to redirect
    const me = await fetch('/api/profile').then((r) => r.json())
    router.push(me.data?.role === 'CLEANER' ? '/cleaner/discover' : '/customer/jobs')
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-slate-900 mb-1">Welcome back</h1>
      <p className="text-sm text-slate-500 mb-6">Sign in to your account</p>
      <div className="space-y-3">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && login()}
          className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        />
        <button
          onClick={login}
          disabled={loading || !email || !password}
          className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium disabled:opacity-40 hover:bg-blue-700 transition-all"
        >
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </div>
      <p className="text-center text-xs text-slate-400 mt-4">
        No account?{' '}
        <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
          Register
        </Link>
      </p>
    </div>
  )
}
