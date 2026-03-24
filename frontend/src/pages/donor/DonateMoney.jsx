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
  const [orderData, setOrderData] = useState(null)

  const onSubmit = async (values) => {
    setSubmitting(true)
    setStatus('')
    try {
      const { data } = await donorService.createOrder({
        amount: Number(values.amount),
        message: values.message,
      })
      setOrderData(data)
      setStatus('Order created! Please complete the payment below.')
    } catch (error) {
      setStatus(
        error.response?.data?.message ||
          'Unable to process donation at the moment.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  const handlePaymentVerification = async () => {
    if (!orderData?.orderId) return
    
    setSubmitting(true)
    try {
      await donorService.verifyPayment({ orderId: orderData.orderId })
      setStatus('Donation successful! Thank you for your contribution.')
      setOrderData(null)
    } catch (error) {
      setStatus('Payment verification failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-semibold text-ink mb-2">
            Donate Money
          </h1>
          <p className="font-sans text-sm text-ink-2">
            Support schools across India with secure monetary contributions
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Donation Form */}
          <Card>
            <div className="mb-6">
              <h2 className="font-display text-lg font-semibold text-ink">
                Make a Donation
              </h2>
              <p className="font-sans mt-1 text-sm text-ink-2">
                Every contribution helps transform lives
              </p>
            </div>

            {!orderData ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div>
                  <Input
                    label="Amount"
                    name="amount"
                    type="number"
                    register={register}
                    error={errors.amount}
                    placeholder="Enter amount in rupees"
                    required
                  />
                  <div className="mt-2 flex gap-2">
                    {[500, 1000, 2000, 5000].map((amount) => (
                      <button
                        key={amount}
                        type="button"
                        onClick={() => {
                          const input = document.querySelector('input[name="amount"]')
                          if (input) {
                            input.value = amount
                            input.dispatchEvent(new Event('input', { bubbles: true }))
                          }
                        }}
                        className="rounded-md border border-border bg-surface px-3 py-1 font-sans text-xs text-ink-2 hover:border-accent hover:text-accent"
                      >
                        ₹{amount}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <Input
                    label="Message (optional)"
                    name="message"
                    register={register}
                    error={errors.message}
                    placeholder="Share why you're supporting education"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  loading={submitting}
                  disabled={submitting}
                >
                  {submitting ? 'Creating Order...' : 'Continue to Payment'}
                </Button>
              </form>
            ) : (
              <div className="space-y-6">
                {/* QR Code Display */}
                <div className="rounded-lg border-2 border-accent bg-accent-light p-6 text-center">
                  <h3 className="font-display mb-4 text-lg font-semibold text-ink">
                    Scan to Pay
                  </h3>
                  
                  {/* Placeholder for QR Code - will be replaced with actual QR */}
                  <div className="mx-auto mb-4 h-48 w-48 rounded-lg bg-white p-4 shadow-inner">
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <div className="mx-auto mb-2 h-24 w-24 rounded bg-accent/20 flex items-center justify-center">
                          <span className="font-display text-2xl font-bold text-accent">QR</span>
                        </div>
                        <p className="font-sans text-xs text-ink-2">QR Code will appear here</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 text-left">
                    <p className="font-sans text-sm text-ink">
                      <strong>Order ID:</strong> {orderData.orderId}
                    </p>
                    <p className="font-sans text-sm text-ink">
                      <strong>Amount:</strong> ₹{orderData.amount}
                    </p>
                  </div>
                </div>

                <Input
                  label="UTR (Transaction Reference)"
                  name="utr"
                  placeholder="Enter UTR from your payment app"
                />

                <Button
                  onClick={handlePaymentVerification}
                  className="w-full"
                  loading={submitting}
                  disabled={submitting}
                >
                  {submitting ? 'Verifying...' : 'Verify Payment'}
                </Button>

                <button
                  onClick={() => {
                    setOrderData(null)
                    setStatus('')
                  }}
                  className="w-full rounded-md border border-border bg-surface px-4 py-2 font-sans text-sm text-ink-2 hover:bg-surface-2"
                >
                  Cancel
                </button>
              </div>
            )}

            {status && (
              <div className={`mt-4 rounded-md p-3 ${
                status.includes('successful') 
                  ? 'bg-green-light text-green' 
                  : status.includes('failed')
                  ? 'bg-red-light text-red'
                  : 'bg-blue-light text-blue'
              }`}>
                <p className="font-sans text-sm">{status}</p>
              </div>
            )}
          </Card>

          {/* Info Card */}
          <Card className="bg-surface-2 border-0">
            <div className="mb-4">
              <h3 className="font-display text-lg font-semibold text-ink">
                How UPI Payment Works
              </h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent text-white font-display text-sm font-bold">
                  1
                </div>
                <div>
                  <h4 className="font-sans text-sm font-medium text-ink">
                    Enter Amount
                  </h4>
                  <p className="font-sans mt-1 text-xs text-ink-2">
                    Choose your donation amount and add a message
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent text-white font-display text-sm font-bold">
                  2
                </div>
                <div>
                  <h4 className="font-sans text-sm font-medium text-ink">
                    Scan QR Code
                  </h4>
                  <p className="font-sans mt-1 text-xs text-ink-2">
                    Scan the generated QR code with any UPI app
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent text-white font-display text-sm font-bold">
                  3
                </div>
                <div>
                  <h4 className="font-sans text-sm font-medium text-ink">
                    Verify Payment
                  </h4>
                  <p className="font-sans mt-1 text-xs text-ink-2">
                    Enter the UTR number to confirm your donation
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-md bg-green-light p-4">
              <h4 className="font-sans text-sm font-medium text-green mb-2">
                💡 Why Your Donation Matters
              </h4>
              <ul className="font-sans text-xs text-green space-y-1">
                <li>• Provides books and learning materials</li>
                <li>• Supports digital infrastructure</li>
                <li>• Enables teacher training programs</li>
                <li>• Creates safe learning environments</li>
              </ul>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}

