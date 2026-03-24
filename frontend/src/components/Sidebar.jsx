import { Link, useLocation } from 'react-router-dom'
import {
  BarChart3,
  BookOpen,
  HeartHandshake,
  LayoutDashboard,
  School,
  UserCog,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const baseItemsByRole = {
  donor: [
    { to: '/donor', label: 'Overview', icon: LayoutDashboard },
    { to: '/donor/donate-money', label: 'Donate Money', icon: HeartHandshake },
    { to: '/donor/donate-books', label: 'Donate Books', icon: BookOpen },
    { to: '/donor/history', label: 'History', icon: BarChart3 },
  ],
  school: [
    { to: '/school', label: 'Overview', icon: LayoutDashboard },
    { to: '/school/profile', label: 'School Profile', icon: School },
    { to: '/school/requirements', label: 'Requirements', icon: BookOpen },
    { to: '/school/events', label: 'Events', icon: HeartHandshake },
  ],
  volunteer: [
    { to: '/volunteer', label: 'Overview', icon: LayoutDashboard },
    { to: '/volunteer/events', label: 'Find Events', icon: BookOpen },
    { to: '/volunteer/my-events', label: 'My Events', icon: HeartHandshake },
  ],
  admin: [
    { to: '/admin', label: 'Overview', icon: LayoutDashboard },
    { to: '/admin/pending-schools', label: 'Schools', icon: School },
    { to: '/admin/pending-volunteers', label: 'Volunteers', icon: HeartHandshake },
    { to: '/admin/users', label: 'Users', icon: UserCog },
  ],
}

export default function Sidebar() {
  const { role, logout } = useAuth()
  const location = useLocation()

  if (!role) return null

  const navItems = baseItemsByRole[role] ?? []

  return (
    <aside className="hidden w-60 border-r border-border bg-surface-2 px-4 py-5 lg:block">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-sm font-semibold text-white">
          ER
        </div>
        <span className="font-display text-base font-semibold text-ink">
          EduReach
        </span>
      </div>
      
      <nav className="space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => {
          const active = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 rounded-md px-3 py-2.5 font-sans text-sm transition-all duration-200 ${
                active
                  ? 'bg-accent-light text-accent border-l-3 border-accent font-semibold'
                  : 'text-ink-2 hover:bg-border hover:text-ink'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

    </aside>
  )
}

