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
          <Card>
            <Loader />
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {/* Total Donations */}
            <Card accent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-sans text-sm font-medium text-ink-2">Total Donations</h3>
                  <p className="font-display mt-2 text-3xl font-bold text-accent">
                    ₹{stats?.totalDonations?.toLocaleString?.() ?? '0'}
                  </p>
                </div>
                <div className="rounded-lg bg-accent-light p-2">
                  <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .343-4.243.587-1.757 1.757H4c-1.103 0-2 .897-2 2s.897.897 2 2v8c0 1.103-.897 2-2 2h5.757c1.657 0 3-.343 4.243-.587 1.757-1.757H16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2h-5.757c-1.657 0-3 .343-4.243.587-1.757-1.757H4c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h5.757c1.657 0 3-.343 4.243-.587 1.757-1.757H16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2h-5.757z" />
                  </svg>
                </div>
              </div>
            </Card>

            {/* Total Users */}
            <Card accent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-sans text-sm font-medium text-ink-2">Total Users</h3>
                  <p className="font-display mt-2 text-3xl font-bold text-accent">
                    {stats?.totalUsers ?? 0}
                  </p>
                </div>
                <div className="rounded-lg bg-accent-light p-2">
                  <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 100 8 8 0 00-8 8 0 008 8zM12 16a4 4 0 100 8 8 0 00-8 8 0 008 8z" />
                  </svg>
                </div>
              </div>
            </Card>

            {/* Total Schools */}
            <Card accent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-sans text-sm font-medium text-ink-2">Total Schools</h3>
                  <p className="font-display mt-2 text-3xl font-bold text-accent">
                    {stats?.totalSchools ?? 0}
                  </p>
                </div>
                <div className="rounded-lg bg-accent-light p-2">
                  <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h-2m2 0h-5a2 2 0 00-2-2h-1m-6 0h6" />
                  </svg>
                </div>
              </div>
            </Card>

            {/* Total Volunteers */}
            <Card accent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-sans text-sm font-medium text-ink-2">Total Volunteers</h3>
                  <p className="font-display mt-2 text-3xl font-bold text-accent">
                    {stats?.totalVolunteers ?? 0}
                  </p>
                </div>
                <div className="rounded-lg bg-accent-light p-2">
                  <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.284 0M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.284 0" />
                  </svg>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

