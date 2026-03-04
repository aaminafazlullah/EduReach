import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import Card from '../../components/Card.jsx'
import Loader from '../../components/Loader.jsx'
import { eventService } from '../../services/eventService.js'

export default function SchoolDashboard() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await eventService.myEvents()
        setEvents(data || [])
      } catch {
        setEvents([])
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
          School overview
        </h1>
        {loading ? (
          <Loader />
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            <Card title="Active events">
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {events.length}
              </p>
            </Card>
            <Card title="Volunteer engagement">
              <p className="mt-2 text-xs text-muted">
                Monitor event participation across your school.
              </p>
            </Card>
            <Card title="Requirements">
              <p className="mt-2 text-xs text-muted">
                Add resource requirements from the Requirements page.
              </p>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

