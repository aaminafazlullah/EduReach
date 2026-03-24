import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import Card from '../../components/Card.jsx'
import { useEffect, useState } from 'react'
import { donorService } from '../../services/donorService.js'
import Loader from '../../components/Loader.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

export default function DonorDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await donorService.history()
        const total = data?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0
        setStats({
          totalDonations: total,
          donationsCount: data?.length || 0,
        })
      } catch {
        setStats({ totalDonations: 0, donationsCount: 0 })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">
            {getGreeting()}, {user?.name || 'Donor'}!
          </h1>
          <p className="font-sans mt-2 text-sm text-ink-2">
            Your generosity is making education accessible to all.
          </p>
        </div>

        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-3">
              <Card accent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-sans text-sm font-medium text-ink-2">Total Donated</h3>
                    <p className="font-display mt-2 text-3xl font-bold text-accent">
                      ₹{stats.totalDonations.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent-light p-2">
                    <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </Card>

              <Card accent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-sans text-sm font-medium text-ink-2">Donations Made</h3>
                    <p className="font-display mt-2 text-3xl font-bold text-accent">
                      {stats.donationsCount}
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent-light p-2">
                    <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </Card>

              <Card accent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-sans text-sm font-medium text-ink-2">Book Donations</h3>
                    <p className="font-sans mt-3 text-sm text-ink">
                      View details in donation history
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent-light p-2">
                    <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
              </Card>
            </div>

            {/* Thank You Banner */}
            <Card className="bg-gradient-to-r from-accent-light to-accent-light/50 border-0">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-accent p-3">
                  <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-ink">
                    Your donations are directly funding education
                  </h3>
                  <p className="font-sans mt-1 text-sm text-ink-2">
                    Thank you for being a champion of learning! 🙏
                  </p>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}

