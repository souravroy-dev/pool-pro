'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { Briefcase, PlusCircle, Search, User, Heart, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = {
  CUSTOMER: [
    { href: '/customer/jobs', icon: Briefcase, label: 'My Jobs' },
    { href: '/customer/jobs/new', icon: PlusCircle, label: 'Post a Job' },
    { href: '/customer/profile', icon: User, label: 'Profile' },
  ],
  CLEANER: [
    { href: '/cleaner/discover', icon: Search, label: 'Discover Jobs' },
    { href: '/cleaner/discover?tab=saved', icon: Heart, label: 'Saved Jobs' },
    { href: '/cleaner/jobs', icon: Briefcase, label: 'My Jobs' },
    { href: '/cleaner/profile', icon: User, label: 'Profile' },
  ],
}

export function Sidebar({ role, name }: { role: string; name: string }) {
  const path = usePathname()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab')

  function isActive(href: string): boolean {
    if (href === '/cleaner/discover?tab=saved') {
      return path === '/cleaner/discover' && tab === 'saved'
    }
    if (href === '/cleaner/discover') {
      return path === '/cleaner/discover' && (!tab || tab !== 'saved')
    }
    return path.startsWith(href)
  }

  const items = NAV[role as keyof typeof NAV] ?? []

  return (
    <aside className="w-56 flex flex-col bg-[#0f172a] shrink-0">
      <div className="px-5 py-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl">🌊</span>
          <span className="text-lg font-bold text-white">PoolPro</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {items.map(({ href, icon: Icon, label }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all',
                active
                  ? 'bg-white/10 text-white font-medium'
                  : 'text-slate-400 hover:text-white hover:bg-white/5',
              )}
            >
              <Icon size={17} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {name[0]?.toUpperCase()}
          </div>
          <span className="text-sm text-slate-300 truncate">{name}</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 w-full transition-all"
        >
          <LogOut size={17} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
