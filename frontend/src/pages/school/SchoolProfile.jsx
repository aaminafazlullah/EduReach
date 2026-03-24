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
      setStatus('School profile saved successfully!')
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
      <div className="max-w-4xl">
        <div className="mb-8">
          <h1 className="font-display text-2xl font-semibold text-ink mb-2">
            School Profile
          </h1>
          <p className="font-sans text-sm text-ink-2">
            Keep your school information up to date for donors and volunteers
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information Section */}
            <div>
              <div className="mb-6 border-t border-border pt-6">
                <h2 className="font-display mb-6 text-lg font-semibold text-ink">
                  Basic Information
                </h2>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <Input
                  label="School Name"
                  name="name"
                  register={register}
                  error={errors.name}
                  placeholder="Enter your school name"
                  required
                />
                <Input
                  label="Principal Name"
                  name="principal"
                  register={register}
                  error={errors.principal}
                  placeholder="Enter principal's full name"
                  required
                />
              </div>

              <Input
                label="Address"
                name="address"
                register={register}
                error={errors.address}
                placeholder="Enter complete school address"
                required
              />
            </div>

            {/* Contact Information Section */}
            <div>
              <div className="mb-6 border-t border-border pt-6">
                <h2 className="font-display mb-6 text-lg font-semibold text-ink">
                  Contact Information
                </h2>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <Input
                  label="Phone Number"
                  name="phone"
                  register={register}
                  error={errors.phone}
                  placeholder="10-digit contact number"
                  inputMode="numeric"
                  required
                />
                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  register={register}
                  error={errors.email}
                  placeholder="school@example.com"
                />
              </div>
            </div>

            {/* School Details Section */}
            <div>
              <div className="mb-6 border-t border-border pt-6">
                <h2 className="font-display mb-6 text-lg font-semibold text-ink">
                  School Details
                </h2>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2">
                <Input
                  label="Number of Students"
                  name="studentCount"
                  type="number"
                  register={register}
                  error={errors.studentCount}
                  placeholder="Total enrolled students"
                  min="1"
                  required
                />
                
                <div>
                  <label className="font-sans mb-2 block text-xs font-medium uppercase tracking-wide text-ink-2">
                    School Type
                  </label>
                  <select
                    {...register('schoolType', { required: true })}
                    className={`w-full rounded-md bg-surface py-3 px-4 text-ink outline-none transition-all duration-150 placeholder:text-ink-2/50 border ${
                      errors.schoolType
                        ? 'border-2 border-red focus:border-red focus:ring-2 focus:ring-red/20'
                        : 'border border-border focus:border-accent focus:ring-2 focus:ring-accent/20'
                    }`}
                  >
                    <option value="">Select school type</option>
                    <option value="government">Government</option>
                    <option value="private">Private</option>
                    <option value="aided">Aided</option>
                  </select>
                  {errors.schoolType && (
                    <p className="font-sans mt-1 text-xs text-red">
                      {errors.schoolType.message || 'This field is required'}
                    </p>
                  )}
                </div>
              </div>

              <Input
                label="UDISE Code"
                name="udiseCode"
                register={register}
                error={errors.udiseCode}
                placeholder="Unique school identification code"
                required
              />
            </div>

            {/* Description Section */}
            <div>
              <div className="mb-6 border-t border-border pt-6">
                <h2 className="font-display mb-6 text-lg font-semibold text-ink">
                  School Description
                </h2>
              </div>
              
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
                  placeholder="Tell us about your school, mission, and achievements..."
                />
                {errors.description && (
                  <p className="font-sans mt-1 text-xs text-red">
                    {errors.description.message || 'This field is required'}
                  </p>
                )}
              </div>
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
            <div className="flex justify-end">
              <Button
                type="submit"
                loading={submitting}
                disabled={submitting}
                className="px-8"
              >
                {submitting ? 'Saving...' : 'Save Profile'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </DashboardLayout>
  )
}

