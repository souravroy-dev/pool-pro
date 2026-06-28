import { cn } from '@/lib/utils'
import { STATUS } from '@/lib/constants'

export function StatusBadge({ status }: { status: keyof typeof STATUS }) {
  const s = STATUS[status]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        s.cls,
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full', s.dot)} />
      {s.label}
    </span>
  )
}
