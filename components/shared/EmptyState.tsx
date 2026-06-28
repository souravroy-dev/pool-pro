import Link from 'next/link'

export function EmptyState({
  icon: Icon,
  title,
  desc,
  action,
}: {
  icon: any
  title: string
  desc: string
  action?: { label: string; href: string }
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-slate-300" />
      </div>
      <p className="font-semibold text-slate-800 mb-1">{title}</p>
      <p className="text-sm text-slate-500 mb-5 max-w-xs">{desc}</p>
      {action && (
        <Link
          href={action.href}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  )
}
