import { useState } from 'react'
import { useForm } from 'react-hook-form'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import Card from '../../components/Card.jsx'
import Input from '../../components/Input.jsx'
import Button from '../../components/Button.jsx'
import { donorService } from '../../services/donorService.js'

export default function DonateMoney() {
  const { register, handleSubmit, formState } = useForm()
  const { errors } = formState
  const [status, setStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const onSubmit = async (values) => {
    setSubmitting(true)
    setStatus('')
    try {
      const { data } = await donorService.createOrder({
        amount: Number(values.amount),
        message: values.message,
      })
      // Razorpay integration hook: data should contain order info
      // For now we just call verify directly to keep flow minimal
      await donorService.verifyPayment({ orderId: data.orderId })
      setStatus('Donation successful. Thank you for your contribution.')
    } catch (error) {
      setStatus(
        error.response?.data?.message ||
          'Unable to process donation at the moment.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-lg">
        <Card
          title="Donate money"
          description="Support schools with a secure monetary contribution."
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Amount (₹)"
              name="amount"
              type="number"
              register={register}
              error={errors.amount}
            />
            <Input
              label="Message (optional)"
              name="message"
              register={register}
              error={errors.message}
            />
            {status && (
              <p className="text-xs text-slate-700">{status}</p>
            )}
            <Button
              type="submit"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? 'Processing…' : 'Donate now'}
            </Button>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}

