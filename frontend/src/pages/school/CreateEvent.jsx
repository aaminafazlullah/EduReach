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
      setStatus('Volunteer event created.')
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
      <div className="max-w-xl">
        <Card
          title="Create volunteer event"
          description="Invite volunteers to support your students."
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Event title"
              name="title"
              register={register}
              error={errors.title}
            />
            <Input
              label="Description"
              name="description"
              register={register}
              error={errors.description}
            />
            <Input
              label="Date"
              name="date"
              type="date"
              register={register}
              error={errors.date}
            />
            <Input
              label="Duration (hours)"
              name="duration"
              register={register}
              error={errors.duration}
            />
            <Input
              label="Volunteers needed"
              name="volunteerCount"
              type="number"
              register={register}
              error={errors.volunteerCount}
            />
            {status && (
              <p className="text-xs text-slate-700">{status}</p>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? 'Creating…' : 'Create event'}
            </Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}

