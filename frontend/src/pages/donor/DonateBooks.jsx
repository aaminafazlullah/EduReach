import { useState } from 'react'
import { useForm } from 'react-hook-form'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import Card from '../../components/Card.jsx'
import Input from '../../components/Input.jsx'
import Button from '../../components/Button.jsx'
import { donorService } from '../../services/donorService.js'

export default function DonateBooks() {
  const { register, handleSubmit, formState, reset } = useForm()
  const { errors } = formState
  const [status, setStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (values) => {
    setSubmitting(true)
    setStatus('')
    try {
      await donorService.bookDonation(values)
      setStatus('Book donation submitted. Our team will coordinate pickup.')
      reset()
    } catch (error) {
      setStatus(
        error.response?.data?.message ||
          'Unable to submit donation. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-lg">
        <Card
          title="Donate books"
          description="Share books with students who need them the most."
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Book title"
              name="title"
              register={register}
              error={errors.title}
            />
            <Input
              label="Author"
              name="author"
              register={register}
              error={errors.author}
            />
            <Input
              label="Condition"
              name="condition"
              register={register}
              error={errors.condition}
            />
            <Input
              label="Quantity"
              name="quantity"
              type="number"
              register={register}
              error={errors.quantity}
            />
            <Input
              label="Pickup address"
              name="address"
              register={register}
              error={errors.address}
            />
            <Input
              label="Contact number"
              name="phone"
              register={register}
              error={errors.phone}
            />
            {status && (
              <p className="text-xs text-slate-700">{status}</p>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? 'Submitting…' : 'Submit book donation'}
            </Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}

