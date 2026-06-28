export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-2xl font-bold text-white">🌊 PoolPro</span>
        </div>
        <div className="bg-white rounded-2xl shadow-card-lg p-8">{children}</div>
      </div>
    </div>
  )
}
