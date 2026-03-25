import { QRCodeSVG } from 'qrcode.react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import DashboardLayout from '../../layouts/DashboardLayout.jsx'
import Card from '../../components/Card.jsx'
import Input from '../../components/Input.jsx'
import Button from '../../components/Button.jsx'
import { donorService } from '../../services/donorService.js'

export default function DonateMoney() {
  const { register, handleSubmit, formState, reset, watch } = useForm()
  const { errors } = formState

  const [status, setStatus] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [orderData, setOrderData] = useState(null)
  const [utr, setUtr] = useState('')

  const amountValue = watch('amount')

  const onSubmit = async (values) => {
    setSubmitting(true)
    setStatus('')

    try {
      const response = await donorService.createOrder({
        amount: Number(values.amount),
        donorNotes: values.message,
      })

      const payload = response.data?.data
      setOrderData(payload)
      setStatus('Order created! Please scan the QR code and complete the payment.')
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
    if (!orderData?.donationId) {
      setStatus('Donation details not found. Please generate the QR again.')
      return
    }

    if (!utr.trim()) {
      setStatus('Please enter the UTR number from your payment app.')
      return
    }

    setSubmitting(true)
    setStatus('')

    try {
      await donorService.verifyPayment({
        donationId: orderData.donationId,
        upiTransactionId: utr.trim(),
      })

      setStatus('Donation submitted successfully! It is now pending admin verification.')
      setOrderData(null)
      setUtr('')
      reset()
    } catch (error) {
      setStatus(
        error.response?.data?.message ||
          'Payment verification failed. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="font-display mb-2 text-2xl font-semibold text-ink">
            Donate Money
          </h1>
          <p className="font-sans text-sm text-ink-2">
            Support schools across India with secure monetary contributions
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
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
                  <div className="mt-2 flex flex-wrap gap-2">
                    {[500, 1000, 2000, 5000].map((presetAmount) => (
                      <button
                        key={presetAmount}
                        type="button"
                        onClick={() => {
                          const input = document.querySelector('input[name="amount"]')
                          if (input) {
                            input.value = presetAmount
                            input.dispatchEvent(new Event('input', { bubbles: true }))
                          }
                        }}
                        className="rounded-md border border-border bg-surface px-3 py-1 font-sans text-xs text-ink-2 hover:border-accent hover:text-accent"
                      >
                        ₹{presetAmount}
                      </button>
                    ))}
                  </div>
                  {amountValue && (
                    <p className="mt-2 font-sans text-xs text-ink-2">
                      Selected amount: ₹{amountValue}
                    </p>
                  )}
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
                <div className="rounded-lg border-2 border-accent bg-accent-light p-6 text-center">
                  <h3 className="font-display mb-4 text-lg font-semibold text-ink">
                    Scan to Pay
                  </h3>

                  <div className="mx-auto mb-4 flex w-fit justify-center rounded-lg bg-white p-4 shadow-inner">
                    {orderData?.upiPaymentString ? (
                      <QRCodeSVG
                        value={orderData.upiPaymentString}
                        size={192}
                      />
                    ) : (
                      <div className="flex h-48 w-48 items-center justify-center text-center">
                        <p className="font-sans text-xs text-ink-2">
                          QR could not be generated
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 text-left">
                    <p className="font-sans text-sm text-ink">
                      <strong>Donation ID:</strong> {orderData.donationId}
                    </p>
                    <p className="font-sans text-sm text-ink">
                      <strong>Amount:</strong> ₹{orderData.amount}
                    </p>
                    <p className="font-sans text-sm text-ink">
                      <strong>UPI ID:</strong> {orderData.upiId}
                    </p>
                    <p className="font-sans text-sm text-ink">
                      <strong>Receiver:</strong> {orderData.upiName}
                    </p>
                  </div>

                  {orderData?.upiPaymentString && (
                    <a
                      href={orderData.upiPaymentString}
                      className="mt-4 inline-block font-sans text-sm font-medium text-accent underline"
                    >
                      Open in UPI App
                    </a>
                  )}
                </div>

                <div>
                  <label className="mb-2 block font-sans text-sm font-medium text-ink">
                    UTR (Transaction Reference)
                  </label>
                  <input
                    type="text"
                    value={utr}
                    onChange={(e) => setUtr(e.target.value)}
                    placeholder="Enter UTR from your payment app"
                    className="w-full rounded-md border border-border bg-white px-3 py-2 font-sans text-sm text-ink outline-none focus:border-accent"
                  />
                </div>

                <Button
                  onClick={handlePaymentVerification}
                  className="w-full"
                  loading={submitting}
                  disabled={submitting}
                >
                  {submitting ? 'Verifying...' : 'Verify Payment'}
                </Button>

                <button
                  type="button"
                  onClick={() => {
                    setOrderData(null)
                    setStatus('')
                    setUtr('')
                  }}
                  className="w-full rounded-md border border-border bg-surface px-4 py-2 font-sans text-sm text-ink-2 hover:bg-surface-2"
                >
                  Cancel
                </button>
              </div>
            )}

            {status && (
              <div
                className={`mt-4 rounded-md p-3 ${
                  status.toLowerCase().includes('success')
                    ? 'bg-green-light text-green'
                    : status.toLowerCase().includes('failed') ||
                        status.toLowerCase().includes('unable') ||
                        status.toLowerCase().includes('could not') ||
                        status.toLowerCase().includes('invalid')
                    ? 'bg-red-light text-red'
                    : 'bg-blue-light text-blue'
                }`}
              >
                <p className="font-sans text-sm">{status}</p>
              </div>
            )}
          </Card>

          <Card className="border-0 bg-surface-2">
            <div className="mb-4">
              <h3 className="font-display text-lg font-semibold text-ink">
                How UPI Payment Works
              </h3>
            </div>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent font-display text-sm font-bold text-white">
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
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent font-display text-sm font-bold text-white">
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
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-accent font-display text-sm font-bold text-white">
                  3
                </div>
                <div>
                  <h4 className="font-sans text-sm font-medium text-ink">
                    Verify Payment
                  </h4>
                  <p className="font-sans mt-1 text-xs text-ink-2">
                    Enter the UTR number after payment to submit your donation
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-md bg-green-light p-4">
              <h4 className="mb-2 font-sans text-sm font-medium text-green">
                 Why Your Donation Matters
              </h4>
              <ul className="space-y-1 font-sans text-xs text-green">
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