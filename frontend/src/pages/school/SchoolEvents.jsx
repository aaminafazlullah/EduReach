import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import Card from '../../components/Card.jsx'
import Loader from '../../components/Loader.jsx'
import Button from '../../components/Button.jsx'
import { Link } from 'react-router-dom'
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: {
        className: 'bg-green-light text-green',
        label: 'Completed'
      },
      upcoming: {
        className: 'bg-accent-light text-accent',
        label: 'Upcoming'
      },
      cancelled: {
        className: 'bg-red-light text-red',
        label: 'Cancelled'
      }
    }
    
    const config = statusConfig[status?.toLowerCase()] || statusConfig.upcoming
    return (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${config.className}`}>
        <span className="mr-1 h-1.5 w-1.5 rounded-full bg-current"></span>
        {config.label}
      </span>
    )
  }

  const isEventCompleted = (status) => status?.toLowerCase() === 'completed'

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink mb-2">
            School Events
          </h1>
          <p className="font-sans text-sm text-ink-2">
            Manage upcoming and completed volunteer events
          </p>
        </div>

        {loading ? (
          <Card>
            <Loader />
          </Card>
        ) : events.length === 0 ? (
          <Card>
            <div className="py-12 text-center">
              <svg className="mx-auto mb-4 h-16 w-16 text-ink-2/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <h3 className="font-display text-lg font-semibold text-ink mb-2">
                No events yet
              </h3>
              <p className="font-sans text-sm text-ink-2 mb-6">
                Create your first volunteer event to engage the community
              </p>
              <Link to="/school/events/create">
                <Button>
                  Create Event
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="flex gap-4">
              <Link to="/school/events/create">
                <Button>
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Create New Event
                </Button>
              </Link>
            </div>

            {/* Events List */}
            <div className="space-y-4">
              {events.map((event) => (
                <Card key={event._id} className="border border-border hover:shadow-elevated transition-shadow duration-200">
                  <div className="flex items-start justify-between p-6">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        {/* Date Badge */}
                        <div className="rounded-lg bg-accent-light px-3 py-2">
                          <div className="text-center">
                            <div className="font-sans text-xs text-ink-2">Date</div>
                            <div className="font-display text-lg font-bold text-accent">
                              {new Date(event.date).getDate()}
                            </div>
                            <div className="font-sans text-xs text-ink-2">
                              {new Date(event.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <h3 className="font-display text-lg font-semibold text-ink mb-2">
                            {event.title}
                          </h3>
                          
                          <div className="flex items-center gap-3 mb-3">
                            {getStatusBadge(event.status)}
                            <span className="font-sans text-xs text-ink-2">
                              👥 {event.volunteers?.length || 0} volunteers
                            </span>
                          </div>
                          
                          {event.description && (
                            <p className="font-sans text-sm text-ink-2 line-clamp-2">
                              {event.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Action Button */}
                    <div className="ml-4">
                      {!isEventCompleted(event.status) && (
                        <Button
                          type="button"
                          onClick={() => markComplete(event._id)}
                          loading={updating}
                          disabled={updating}
                          className="text-xs"
                        >
                          {updating ? 'Updating...' : 'Mark Complete'}
                        </Button>
                      )}
                      
                      {isEventCompleted(event.status) && (
                        <div className="text-center">
                          <svg className="h-5 w-5 text-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <p className="font-sans text-xs text-green mt-1">Completed</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

