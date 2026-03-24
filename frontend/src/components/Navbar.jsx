import { Bell, LogOut, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const { logout, role } = useAuth()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const getPageTitle = () => {
    if (!role) return 'Dashboard'
    const path = location.pathname
    if (path === '/donor' || path === '/school' || path === '/volunteer' || path === '/admin') {
      return `${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard`
    }
    const routeMap = {
      '/donor/donate-money': 'Donate Money',
      '/donor/donate-books': 'Donate Books',
      '/donor/history': 'Donation History',
      '/school/profile': 'School Profile',
      '/school/requirements': 'Requirements',
      '/school/events': 'School Events',
      '/volunteer/events': 'Find Events',
      '/volunteer/my-events': 'My Events',
      '/volunteer/profile': 'Volunteer Profile',
      '/admin/pending-schools': 'Pending Schools',
      '/admin/pending-volunteers': 'Pending Volunteers',
      '/admin/users': 'Users',
    }
    return routeMap[path] || 'Dashboard'
  }

  return (
    <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-4 lg:px-6">
      <div className="flex-1">
        <h1 className="font-display text-lg text-ink">
          {getPageTitle()}
        </h1>
      </div>
      
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
        >
          <Bell className="h-4 w-4" />
        </button>
        
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 font-sans text-xs font-medium text-ink transition-colors hover:bg-surface-2"
          >
            <User className="h-3.5 w-3.5" />
            <span>Account</span>
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-surface shadow-elevated border border-border z-50 animate-page-enter">
              <Link 
                to={`/${role === 'admin' || role === 'donor' || !role ? role : role + '/profile?mode=view'}`} 
                onClick={() => setDropdownOpen(false)}
                className="block px-4 py-2 font-sans text-sm text-ink transition-colors hover:bg-surface-2"
              >
                View Profile
              </Link>
              <Link 
                to={`/${role === 'admin' || role === 'donor' || !role ? role : role + '/profile?mode=edit'}`} 
                onClick={() => setDropdownOpen(false)}
                className="block px-4 py-2 font-sans text-sm text-ink transition-colors hover:bg-surface-2"
              >
                Edit Profile
              </Link>
              <button
                onClick={() => {
                  setDropdownOpen(false)
                  logout()
                }}
                className="flex w-full items-center gap-2 px-4 py-2 font-sans text-sm text-red transition-colors hover:bg-red-light"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

