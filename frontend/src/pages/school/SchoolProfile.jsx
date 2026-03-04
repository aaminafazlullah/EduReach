import { useState } from 'react'
import { useForm } from 'react-hook-form'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import Card from '../../components/Card.jsx'
import Input from '../../components/Input.jsx'
import Button from '../../components/Button.jsx'
import { schoolService } from '../../services/schoolService.js'

export default function SchoolProfile() {
  const { register, handleSubmit, formState } = useForm()
  const { errors } = formState
  const [status, setStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (values) => {
    setSubmitting(true)
    setStatus('')
    try {
      await schoolService.createOrUpdateProfile(values)
      setStatus('School profile saved successfully.')
    } catch (error) {
      setStatus(
        error.response?.data?.message ||
          'Unable to save profile. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <Card
          title="School profile"
          description="Keep your school information up to date for donors and volunteers."
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="School name"
              name="name"
              register={register}
              error={errors.name}
            />
            <Input
              label="Principal name"
              name="principal"
              register={register}
              error={errors.principal}
            />
            <Input
              label="Address"
              name="address"
              register={register}
              error={errors.address}
            />
            <Input
              label="Phone"
              name="phone"
              register={register}
              error={errors.phone}
            />
            <Input
              label="Number of students"
              name="studentCount"
              type="number"
              register={register}
              error={errors.studentCount}
            />
            <Input
              label="Description"
              name="description"
              register={register}
              error={errors.description}
            />
            {status && (
              <p className="text-xs text-slate-700">{status}</p>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? 'Saving…' : 'Save profile'}
            </Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}

