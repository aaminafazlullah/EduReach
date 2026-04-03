import { useState } from 'react'
import { useForm } from 'react-hook-form'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import Card from '../../components/Card.jsx'
import Input from '../../components/Input.jsx'
import Button from '../../components/Button.jsx'
import { eventService } from '../../services/eventService.js'

export default function CreateEvent() {
  const { register, handleSubmit, formState, reset } = useForm()
  const { errors } = formState
  const [status, setStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (values) => {
    setSubmitting(true)
    setStatus('')
    try {
      await eventService.createEvent(values)
      setStatus('Volunteer event created successfully!')
      reset()
    } catch (error) {
      setStatus(
        error.response?.data?.message ||
          'Unable to create event. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-semibold text-ink mb-2">
            Create Volunteer Event
          </h1>
          <p className="font-sans text-sm text-ink-2">
            Invite volunteers to support your students and school activities
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card accent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Event Details Section */}
            <div>
              <div className="mb-6 border-t border-border pt-6">
                <h2 className="font-display mb-6 text-lg font-semibold text-ink">
                  Event Details
                </h2>
              </div>
              
              <Input
                label="Event Title"
                name="title"
                register={register}
                error={errors.title}
                placeholder="e.g., Science Fair, Tree Plantation Drive"
                required
              />

              <div>
                <label className="font-sans mb-2 block text-xs font-medium uppercase tracking-wide text-ink-2">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  className={`w-full rounded-md bg-surface py-3 px-4 text-ink outline-none transition-all duration-150 placeholder:text-ink-2/50 border resize-none ${
                    errors.description
                      ? 'border-2 border-red focus:border-red focus:ring-2 focus:ring-red/20'
                      : 'border border-border focus:border-accent focus:ring-2 focus:ring-accent/20'
                  }`}
                  rows={4}
                  placeholder="Describe the event activities, goals, and what volunteers will do..."
                />
                {errors.description && (
                  <p className="font-sans mt-1 text-xs text-red">
                    {errors.description.message || 'This field is required'}
                  </p>
                )}
              </div>
            </div>

            {/* Event Schedule Section */}
            <div>
              <div className="mb-6 border-t border-border pt-6">
                <h2 className="font-display mb-6 text-lg font-semibold text-ink">
                  Schedule & Requirements
                </h2>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <Input
                  label="Event Date"
                  name="date"
                  type="date"
                  register={register}
                  error={errors.date}
                  required
                />

                <Input
                  label="Duration (hours)"
                  name="duration"
                  type="number"
                  register={register}
                  error={errors.duration}
                  placeholder="e.g., 2, 4, 8"
                  min="1"
                  required
                />
              </div>

              <Input
                label="Volunteers Needed"
                name="volunteerCount"
                type="number"
                register={register}
                error={errors.volunteerCount}
                placeholder="Number of volunteers required"
                min="1"
                required
              />
            </div>

            {/* Status Message */}
            {status && (
              <div className={`rounded-md p-4 ${
                status.includes('successfully') 
                  ? 'bg-green-light text-green' 
                  : 'bg-red-light text-red'
              }`}>
                <p className="font-sans text-sm">{status}</p>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center gap-3">
              <Button
                type="submit"
                loading={submitting}
                disabled={submitting}
                className="flex-1"
              >
                {submitting ? 'Creating...' : 'Create Event'}
              </Button>
            </div>
          </form>
            </Card>
          </div>

          {/* Info Cards */}
          <div className="space-y-6">
          <Card className="bg-surface-2 border-0">
            <div className="mb-4">
              <h3 className="font-display text-base font-semibold text-ink">
                Event Ideas
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-accent"></div>
                <span className="font-sans text-sm text-ink">Educational Workshops</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-green"></div>
                <span className="font-sans text-sm text-ink">Environmental Activities</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-blue"></div>
                <span className="font-sans text-sm text-ink">Sports & Cultural Events</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-2 w-2 rounded-full bg-red"></div>
                <span className="font-sans text-sm text-ink">Infrastructure Support</span>
              </div>
            </div>
          </Card>

          <Card className="bg-surface-2 border-0">
            <div className="mb-4">
              <h3 className="font-display text-base font-semibold text-ink">
                Best Practices
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent text-white text-xs font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-sans text-sm font-medium text-ink">
                    Clear Instructions
                  </h4>
                  <p className="font-sans mt-1 text-xs text-ink-2">
                    Provide specific tasks and expectations
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent text-white text-xs font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-sans text-sm font-medium text-ink">
                    Set Realistic Goals
                  </h4>
                  <p className="font-sans mt-1 text-xs text-ink-2">
                    Match volunteer count to actual needs
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent text-white text-xs font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-sans text-sm font-medium text-ink">
                    Plan Logistics
                  </h4>
                  <p className="font-sans mt-1 text-xs text-ink-2">
                    Consider materials, space, and timing
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-md bg-green-light p-4">
              <h4 className="font-sans text-sm font-medium text-green mb-2">
                🎯 Impact of Volunteer Events
              </h4>
              <ul className="font-sans text-xs text-green space-y-1">
                <li>• Brings community support to schools</li>
                <li>• Provides diverse learning opportunities</li>
                <li>• Builds stronger school-community relationships</li>
                <li>• Creates positive educational environments</li>
              </ul>
            </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

