import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import Card from '../../components/Card.jsx'
import Loader from '../../components/Loader.jsx'
import { eventService } from '../../services/eventService.js'

export default function MyEvents() {
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
      <Card
        title="My events"
        description="Events you are currently assigned to."
      >
        {loading ? (
          <Loader />
        ) : events.length === 0 ? (
          <p className="text-xs text-muted">No events assigned yet.</p>
        ) : (
          <ul className="space-y-3 text-xs">
            {events.map((ev) => (
              <li
                key={ev.id}
                className="rounded-lg border border-slate-100 bg-white px-3 py-2"
              >
                <p className="font-medium text-slate-900">{ev.title}</p>
                <p className="text-[11px] text-muted">
                  {ev.date && new Date(ev.date).toLocaleDateString()} ·{' '}
                  {ev.status || 'Scheduled'}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </DashboardLayout>
  )
}

