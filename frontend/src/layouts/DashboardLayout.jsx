import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Sidebar from '../components/Sidebar.jsx'

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-background text-slate-900">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="flex-1 px-6 py-6 lg:px-8 lg:py-8">
          {children ?? <Outlet />}
        </main>
      </div>
    </div>
  )
}

