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
      setStatus('Book donation submitted! Our team will coordinate pickup.')
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
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-semibold text-ink mb-2">
            Donate Books
          </h1>
          <p className="font-sans text-sm text-ink-2">
            Share the gift of knowledge with students who need it most
          </p>
        </div>

        <Card>
          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4">
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white font-display text-sm font-bold">
                  1
                </div>
                <span className="ml-2 font-sans text-sm font-medium text-ink">Book Details</span>
              </div>
              <div className="h-px w-12 bg-border"></div>
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white font-display text-sm font-bold">
                  2
                </div>
                <span className="ml-2 font-sans text-sm font-medium text-ink">Pickup Info</span>
              </div>
              <div className="h-px w-12 bg-border"></div>
              <div className="flex items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-white font-display text-sm font-bold">
                  3
                </div>
                <span className="ml-2 font-sans text-sm font-medium text-ink">Submit</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Step 1: Book Details */}
            <div className="space-y-6">
              <div>
                <h3 className="font-display mb-4 text-lg font-semibold text-ink">
                  Book Information
                </h3>
                
                <div className="grid gap-6 md:grid-cols-2">
                  <Input
                    label="Book Title"
                    name="title"
                    register={register}
                    error={errors.title}
                    placeholder="Enter the book title"
                    required
                  />
                  <Input
                    label="Author"
                    name="author"
                    register={register}
                    error={errors.author}
                    placeholder="Enter the author name"
                    required
                  />
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div>
                    <label className="font-sans mb-2 block text-xs font-medium uppercase tracking-wide text-ink-2">
                      Condition
                    </label>
                    <select
                      {...register('condition', { required: true })}
                      className={`w-full rounded-md bg-surface py-3 px-4 text-ink outline-none transition-all duration-150 placeholder:text-ink-2/50 border ${
                        errors.condition
                          ? 'border-2 border-red focus:border-red focus:ring-2 focus:ring-red/20'
                          : 'border border-border focus:border-accent focus:ring-2 focus:ring-accent/20'
                      }`}
                    >
                      <option value="">Select condition</option>
                      <option value="excellent">Excellent - Like New</option>
                      <option value="good">Good - Minor Wear</option>
                      <option value="fair">Fair - Noticeable Wear</option>
                      <option value="poor">Poor - Significant Wear</option>
                    </select>
                    {errors.condition && (
                      <p className="font-sans mt-1 text-xs text-red">
                        {errors.condition.message || 'This field is required'}
                      </p>
                    )}
                  </div>
                  
                  <Input
                    label="Quantity"
                    name="quantity"
                    type="number"
                    register={register}
                    error={errors.quantity}
                    placeholder="Number of books"
                    min="1"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Pickup Information */}
            <div className="space-y-6">
              <div>
                <h3 className="font-display mb-4 text-lg font-semibold text-ink">
                  Pickup Information
                </h3>
                
                <Input
                  label="Pickup Address"
                  name="address"
                  register={register}
                  error={errors.address}
                  placeholder="Enter complete pickup address"
                  required
                />
                
                <div className="grid gap-6 md:grid-cols-2">
                  <Input
                    label="Contact Number"
                    name="phone"
                    register={register}
                    error={errors.phone}
                    placeholder="10-digit mobile number"
                    inputMode="numeric"
                    required
                  />
                  <Input
                    label="Email (Optional)"
                    name="email"
                    type="email"
                    register={register}
                    error={errors.email}
                    placeholder="For confirmation"
                  />
                </div>
              </div>
            </div>

            {/* Status Message */}
            {status && (
              <div className={`rounded-md p-4 ${
                status.includes('submitted') 
                  ? 'bg-green-light text-green' 
                  : 'bg-red-light text-red'
              }`}>
                <p className="font-sans text-sm">{status}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              loading={submitting}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Submit Book Donation'}
            </Button>
          </form>
        </Card>

        {/* Info Card */}
        <Card className="mt-8 bg-surface-2 border-0">
          <div className="mb-4">
            <h3 className="font-display text-lg font-semibold text-ink">
              What Happens Next?
            </h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent text-white text-xs font-bold">
                1
              </div>
              <div>
                <h4 className="font-sans text-sm font-medium text-ink">
                  Review & Confirmation
                </h4>
                <p className="font-sans mt-1 text-xs text-ink-2">
                  We'll review your donation details and contact you within 24 hours
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent text-white text-xs font-bold">
                2
              </div>
              <div>
                <h4 className="font-sans text-sm font-medium text-ink">
                  Pickup Coordination
                </h4>
                <p className="font-sans mt-1 text-xs text-ink-2">
                  Our team will schedule a convenient pickup time at your location
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent text-white text-xs font-bold">
                3
              </div>
              <div>
                <h4 className="font-sans text-sm font-medium text-ink">
                  Impact Delivery
                </h4>
                <p className="font-sans mt-1 text-xs text-ink-2">
                  Books are sorted and distributed to students in need across India
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-md bg-green-light p-4">
            <h4 className="font-sans text-sm font-medium text-green mb-2">
              📚 Impact of Your Book Donation
            </h4>
            <ul className="font-sans text-xs text-green space-y-1">
              <li>• Each book can educate multiple students over its lifetime</li>
              <li>• Helps bridge the education gap in underserved communities</li>
              <li>• Promotes reading culture and academic excellence</li>
              <li>• Reduces environmental waste through book reuse</li>
            </ul>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}

