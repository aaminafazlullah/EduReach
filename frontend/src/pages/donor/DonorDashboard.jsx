import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import Card from '../../components/Card.jsx'
import { useEffect, useState } from 'react'
import { donorService } from '../../services/donorService.js'
import Loader from '../../components/Loader.jsx'

export default function DonorDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

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

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-lg font-semibold tracking-tight text-slate-900">
          Donor overview
        </h1>
        {loading ? (
          <Loader />
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            <Card title="Total donated">
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                ₹{stats.totalDonations.toLocaleString()}
              </p>
            </Card>
            <Card title="Donations made">
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {stats.donationsCount}
              </p>
            </Card>
            <Card title="Book donations">
              <p className="mt-2 text-xs text-muted">
                View details in donation history.
              </p>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

