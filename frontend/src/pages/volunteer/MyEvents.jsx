import { useEffect, useState } from 'react'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import Card from '../../components/Card.jsx'
import Loader from '../../components/Loader.jsx'
import Button from '../../components/Button.jsx'
import { volunteerService } from '../../services/volunteerService.js'
import { useAuth } from '../../context/AuthContext.jsx'

export default function MyEvents() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingAction, setLoadingAction] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  
  const { userId } = useAuth()

  const loadEvents = async () => {
    try {
      const { data } = await volunteerService.getEvents()
      setEvents(data?.data || [])
    } catch {
      setEvents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEvents()
  }, [])

  const handleApply = async (eventId) => {
    setLoadingAction(true)
    setStatusMessage('')
    try {
      await volunteerService.applyForEvent(eventId)
      setStatusMessage('Applied successfully!')
      loadEvents()
    } catch (err) {
      setStatusMessage(err.response?.data?.message || 'Failed to apply')
    } finally {
      setLoadingAction(false)
      setTimeout(() => setStatusMessage(''), 3000)
    }
  }

  const handleWithdraw = async (eventId) => {
    setLoadingAction(true)
    setStatusMessage('')
    try {
      await volunteerService.withdrawFromEvent(eventId)
      setStatusMessage('Withdrawn successfully!')
      loadEvents()
    } catch (err) {
      setStatusMessage(err.response?.data?.message || 'Failed to withdraw')
    } finally {
      setLoadingAction(false)
      setTimeout(() => setStatusMessage(''), 3000)
    }
  }

  const getStatusBadge = (isRegistered) => {
    return (
      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
        isRegistered
          ? 'bg-green-light text-green'
          : 'bg-accent-light text-accent'
      }`}>
        <span className="mr-1 h-1.5 w-1.5 rounded-full bg-current"></span>
        {isRegistered ? 'Registered' : 'Available'}
      </span>
    )
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink mb-2">
            My Events
          </h1>
          <p className="font-sans text-sm text-ink-2">
            View and manage your event registrations
          </p>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div className={`rounded-md p-4 ${
            statusMessage.includes('successfully') 
              ? 'bg-green-light text-green' 
              : 'bg-red-light text-red'
          }`}>
            <p className="font-sans text-sm">{statusMessage}</p>
          </div>
        )}

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
                No events found
              </h3>
              <p className="font-sans text-sm text-ink-2 mb-6">
                Explore available events to start volunteering
              </p>
              <Button>
                Explore Events
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {events.map((event) => {
              const isRegistered = event.isApplied

              return (
                <Card key={event._id} className="border border-border hover:shadow-elevated transition-shadow duration-200">
                  <div className="p-6">
                    {/* Header */}
                    <div className="mb-4">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-display text-lg font-semibold text-ink">
                          {event.title}
                        </h3>
                        {getStatusBadge(isRegistered)}
                      </div>
                      
                      <p className="font-sans text-sm text-ink-2">
                        {event.eventType?.toUpperCase()} • {event.location?.city || 'Location TBD'}
                      </p>
                    </div>

                    {/* Description */}
                    {event.description && (
                      <p className="font-sans text-sm text-ink-2 mb-4 line-clamp-3">
                        {event.description}
                      </p>
                    )}

                    {/* Event Details */}
                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-ink-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="font-sans text-xs text-ink-2">
                          {formatDate(event.date)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4 text-ink-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-sans text-xs text-ink-2">
                          {event.durationHours || 'N/A'} hours
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-center">
                      {isRegistered ? (
                        <Button
                          variant="danger"
                          onClick={() => handleWithdraw(event._id)}
                          loading={loadingAction}
                          disabled={loadingAction}
                          className="w-full"
                        >
                          {loadingAction ? 'Withdrawing...' : 'Withdraw Application'}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleApply(event._id)}
                          loading={loadingAction}
                          disabled={loadingAction}
                          className="w-full"
                        >
                          {loadingAction ? 'Applying...' : 'Apply Now'}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
