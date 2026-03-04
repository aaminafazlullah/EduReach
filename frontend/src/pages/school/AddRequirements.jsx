import { useState } from 'react'
import { useForm } from 'react-hook-form'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import Card from '../../components/Card.jsx'
import Input from '../../components/Input.jsx'
import Button from '../../components/Button.jsx'
import { schoolService } from '../../services/schoolService.js'

export default function AddRequirements() {
  const { register, handleSubmit, formState, reset } = useForm()
  const { errors } = formState
  const [status, setStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (values) => {
    setSubmitting(true)
    setStatus('')
    try {
      await schoolService.addRequirement(values)
      setStatus('Requirement added successfully.')
      reset()
    } catch (error) {
      setStatus(
        error.response?.data?.message ||
          'Unable to add requirement. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-xl">
        <Card
          title="Add school requirement"
          description="Share specific resource needs with donors and volunteers."
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Requirement title"
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
              label="Quantity needed"
              name="quantity"
              type="number"
              register={register}
              error={errors.quantity}
            />
            {status && (
              <p className="text-xs text-slate-700">{status}</p>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? 'Submitting…' : 'Add requirement'}
            </Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}

