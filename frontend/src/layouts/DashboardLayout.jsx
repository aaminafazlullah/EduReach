import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from '../components/Navbar.jsx'
import Sidebar from '../components/Sidebar.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { X, CheckCircle2 } from 'lucide-react'

export default function DashboardLayout({ children }) {
  const { showLoginToast, setShowLoginToast, role } = useAuth()

  useEffect(() => {
    if (showLoginToast) {
      const timer = setTimeout(() => setShowLoginToast(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [showLoginToast, setShowLoginToast])
  return (
    <div className="flex min-h-screen bg-bg text-ink">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="flex-1 px-6 py-6 lg:px-8 lg:py-8 page-enter relative overflow-x-hidden">
          {children ?? <Outlet />}
        </main>
      </div>

      {/* Global Login Toast */}
      {showLoginToast && (
        <div className="fixed bottom-6 right-6 z-[9999] flex w-80 flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-elevated transition-all animate-[pageEnter_0.3s_ease-out]">
          <div className="flex items-start gap-4 p-4">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-green text-surface">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            
            <div className="flex-1 pt-0.5">
              <h3 className="font-display text-sm font-semibold text-ink">Login Successful</h3>
              <p className="font-sans mt-0.5 text-xs text-ink-2">
                Logged in as <span className="font-medium capitalize text-ink">{role}</span>
              </p>
            </div>
            
            <button 
              type="button"
              onClick={() => setShowLoginToast(false)}
              className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-ink-2 transition-colors hover:bg-surface-2 hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {/* Loading Progress Bar */}
          <div className="h-1 w-full bg-surface-2">
            <div 
              className="h-full bg-green"
              style={{ animation: 'shrink 3s linear forwards' }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

