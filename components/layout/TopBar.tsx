'use client'

import { usePathname } from 'next/navigation'

const ROLE_BADGE: Record<string, string> = {
  CUSTOMER: 'Pool Owner',
  CLEANER: 'Pool Cleaner',
}

const PAGE_TITLES: Record<string, string> = {
  '/customer/jobs': 'My Jobs',
  '/customer/jobs/new': 'Post a Job',
  '/customer/profile': 'Profile',
  '/cleaner/discover': 'Discover Jobs',
  '/cleaner/jobs': 'My Jobs',
  '/cleaner/profile': 'Profile',
}

export function TopBar({ name, role }: { name: string; role: string }) {
  const path = usePathname()

  // Find matching title
  const title = Object.entries(PAGE_TITLES).find(([key]) =>
    path.startsWith(key),
  )?.[1]

  return (
    <header className="h-14 bg-white border-b border-slate-100 flex items-center px-6 gap-4 shrink-0">
      {title && (
        <h1 className="text-lg font-bold text-slate-900">{title}</h1>
      )}
      <div className="flex-1" />
      <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full font-medium">
        {ROLE_BADGE[role] ?? role}
      </span>
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm font-bold shadow-sm">
        {name[0]?.toUpperCase()}
      </div>
    </header>
  )
}
