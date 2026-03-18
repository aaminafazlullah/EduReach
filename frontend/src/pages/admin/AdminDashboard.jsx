import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import Card from '../../components/Card.jsx'
import Loader from '../../components/Loader.jsx'
import { adminService } from '../../services/adminService.js'
import EmailVerificationBadge from '../../components/EmailVerificationBadge.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function AdminDashboard() {
  const { emailVerified } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await adminService.stats()
        setStats(data)
      } catch {
        setStats(null)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight text-slate-900">
            Admin overview
          </h1>
          <EmailVerificationBadge isVerified={emailVerified} />
        </div>
        {loading ? (
          <Loader />
        ) : (
          <div className="grid gap-4 md:grid-cols-4">
            <Card title="Total donations">
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                ₹{stats?.totalDonations?.toLocaleString?.() ?? '0'}
              </p>
            </Card>
            <Card title="Users">
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {stats?.totalUsers ?? 0}
              </p>
            </Card>
            <Card title="Schools">
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {stats?.totalSchools ?? 0}
              </p>
            </Card>
            <Card title="Volunteers">
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {stats?.totalVolunteers ?? 0}
              </p>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

