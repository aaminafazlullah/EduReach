import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import Card from '../../components/Card.jsx'
import Loader from '../../components/Loader.jsx'
import Button from '../../components/Button.jsx'
import { eventService } from '../../services/eventService.js'
import { Link } from 'react-router-dom'

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

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const upcomingEvents = events.filter(e => new Date(e.date) > new Date())
  const activeEvents = events.filter(e => {
    const eventDate = new Date(e.date)
    const now = new Date()
    return eventDate <= now && eventDate >= new Date(now.getTime() - 24 * 60 * 60 * 1000)
  })

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink mb-2">
            {getGreeting()}, School Admin!
          </h1>
          <p className="font-sans text-sm text-ink-2">
            Manage your school's events and requirements efficiently
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
                    <h3 className="font-sans text-sm font-medium text-ink-2">Active Events</h3>
                    <p className="font-display mt-2 text-3xl font-bold text-accent">
                      {activeEvents.length}
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent-light p-2">
                    <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </Card>

              <Card accent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-sans text-sm font-medium text-ink-2">Volunteer Engagement</h3>
                    <p className="font-display mt-2 text-3xl font-bold text-accent">
                      {events.reduce((sum, e) => sum + (e.volunteers?.length || 0), 0)}
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent-light p-2">
                    <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.284 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                </div>
              </Card>

              <Card accent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-sans text-sm font-medium text-ink-2">Requirements</h3>
                    <p className="font-sans mt-3 text-sm text-ink">
                      Add and manage resource needs
                    </p>
                  </div>
                  <div className="rounded-lg bg-accent-light p-2">
                    <svg className="h-5 w-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                    </svg>
                  </div>
                </div>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2">
              <Card className="border-0 bg-surface-2">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-accent p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-semibold text-ink">
                      Create Event
                    </h3>
                    <p className="font-sans mt-1 text-sm text-ink-2">
                      Organize volunteer activities
                    </p>
                    <Link to="/school/events?action=create">
                      <Button className="mt-3">
                        Create New Event
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>

              <Card className="border-0 bg-surface-2">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-green p-3">
                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-semibold text-ink">
                      Update Requirements
                    </h3>
                    <p className="font-sans mt-1 text-sm text-ink-2">
                      Add books, supplies, and more
                    </p>
                    <Link to="/school/requirements">
                      <Button variant="outline" className="mt-3">
                        Manage Requirements
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>

            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <Card>
                <div className="mb-4">
                  <h3 className="font-display text-lg font-semibold text-ink">
                    Upcoming Events
                  </h3>
                  <p className="font-sans text-sm text-ink-2">
                    Events scheduled for the coming days
                  </p>
                </div>
                
                <div className="space-y-3">
                  {upcomingEvents.slice(0, 3).map((event) => (
                    <div key={event._id} className="flex items-center justify-between rounded-lg border border-border bg-surface p-4">
                      <div className="flex-1">
                        <h4 className="font-sans text-sm font-medium text-ink">
                          {event.title}
                        </h4>
                        <div className="mt-1 flex items-center gap-4">
                          <span className="font-sans text-xs text-ink-2">
                            {new Date(event.date).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </span>
                          <span className="font-sans text-xs text-ink-2">
                            {event.volunteers?.length || 0} volunteers
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <Link to={`/school/events?action=edit&id=${event._id}`}>
                          <Button variant="outline" className="text-xs">
                            Manage
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>

                {upcomingEvents.length > 3 && (
                  <div className="mt-4 text-center">
                    <Link to="/school/events">
                      <Button variant="outline">
                        View All Events
                      </Button>
                    </Link>
                  </div>
                )}
              </Card>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
