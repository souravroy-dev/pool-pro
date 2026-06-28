export const STATUS = {
  OPEN:        { label: 'Open',        cls: 'bg-blue-50 text-blue-700 border-blue-200',    dot: 'bg-blue-500' },
  ASSIGNED:    { label: 'Assigned',    cls: 'bg-amber-50 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  IN_PROGRESS: { label: 'In Progress', cls: 'bg-violet-50 text-violet-700 border-violet-200', dot: 'bg-violet-500' },
  COMPLETED:   { label: 'Completed',   cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  CANCELLED:   { label: 'Cancelled',   cls: 'bg-slate-100 text-slate-500 border-slate-200', dot: 'bg-slate-400' },
} as const

export const POOL_TYPES = {
  INGROUND:     { label: 'In-Ground',    emoji: '🏊' },
  ABOVE_GROUND: { label: 'Above Ground', emoji: '🪣' },
  SPA:          { label: 'Spa / Hot Tub', emoji: '♨️' },
  COMMERCIAL:   { label: 'Commercial',   emoji: '🏢' },
} as const
