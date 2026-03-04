import { Bell, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { logout, role } = useAuth()

  return (
    <header className="flex items-center justify-between border-b bg-surface/80 px-4 py-3 shadow-sm backdrop-blur-sm lg:px-6">
      <div className="flex flex-col">
        <span className="text-xs uppercase tracking-wide text-muted">
          EduReach
        </span>
        <span className="text-sm font-medium capitalize text-slate-900">
          {role ? `${role} dashboard` : 'Dashboard'}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border bg-surface text-slate-600 shadow-sm hover:bg-slate-50"
        >
          <Bell className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={logout}
          className="inline-flex items-center gap-2 rounded-full border bg-surface px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  )
}

