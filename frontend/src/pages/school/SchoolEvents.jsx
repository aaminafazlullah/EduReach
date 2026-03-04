import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import Card from '../../components/Card.jsx'
import Loader from '../../components/Loader.jsx'
import Button from '../../components/Button.jsx'
import { eventService } from '../../services/eventService.js'

export default function SchoolEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const loadEvents = async () => {
    setLoading(true)
    try {
      const { data } = await eventService.myEvents()
      setEvents(data || [])
    } catch {
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  const markComplete = async (eventId) => {
    setUpdating(true)
    try {
      await eventService.completeEvent({ eventId })
      await loadEvents()
    } finally {
      setUpdating(false)
    }
  }

  return (
    <DashboardLayout>
      <Card
        title="Volunteer events"
        description="Manage upcoming and completed volunteer events."
      >
        {loading ? (
          <Loader />
        ) : events.length === 0 ? (
          <p className="text-xs text-muted">No events yet.</p>
        ) : (
          <ul className="space-y-3 text-xs">
            {events.map((ev) => (
              <li
                key={ev.id}
                className="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-3 py-2"
              >
                <div>
                  <p className="font-medium text-slate-900">{ev.title}</p>
                  <p className="text-[11px] text-muted">
                    {ev.date && new Date(ev.date).toLocaleDateString()} ·{' '}
                    {ev.status || 'Scheduled'}
                  </p>
                </div>
                {ev.status !== 'Completed' && (
                  <Button
                    type="button"
                    className="px-3 py-1 text-xs"
                    disabled={updating}
                    onClick={() => markComplete(ev.id)}
                  >
                    Mark complete
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>
    </DashboardLayout>
  )
}

