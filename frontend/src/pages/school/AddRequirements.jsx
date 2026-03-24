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
      setStatus('Requirement added successfully!')
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
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-semibold text-ink mb-2">
            Add School Requirements
          </h1>
          <p className="font-sans text-sm text-ink-2">
            Share specific resource needs with donors and volunteers
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="Requirement Title"
              name="title"
              register={register}
              error={errors.title}
              placeholder="e.g., Science Lab Equipment, Library Books"
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
                placeholder="Describe the requirement in detail (specifications, purpose, urgency...)"
              />
              {errors.description && (
                <p className="font-sans mt-1 text-xs text-red">
                  {errors.description.message || 'This field is required'}
                </p>
              )}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <Input
                label="Quantity Needed"
                name="quantity"
                type="number"
                register={register}
                error={errors.quantity}
                placeholder="Number of items needed"
                min="1"
                required
              />

              <div>
                <label className="font-sans mb-2 block text-xs font-medium uppercase tracking-wide text-ink-2">
                  Priority Level
                </label>
                <select
                  {...register('priority', { required: true })}
                  className={`w-full rounded-md bg-surface py-3 px-4 text-ink outline-none transition-all duration-150 placeholder:text-ink-2/50 border ${
                    errors.priority
                      ? 'border-2 border-red focus:border-red focus:ring-2 focus:ring-red/20'
                      : 'border border-border focus:border-accent focus:ring-2 focus:ring-accent/20'
                  }`}
                >
                  <option value="">Select priority</option>
                  <option value="low">Low - Nice to have</option>
                  <option value="medium">Medium - Helpful</option>
                  <option value="high">High - Essential</option>
                  <option value="urgent">Urgent - Critical need</option>
                </select>
                {errors.priority && (
                  <p className="font-sans mt-1 text-xs text-red">
                    {errors.priority.message || 'This field is required'}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="font-sans mb-2 block text-xs font-medium uppercase tracking-wide text-ink-2">
                Category
              </label>
              <select
                {...register('category', { required: true })}
                className={`w-full rounded-md bg-surface py-3 px-4 text-ink outline-none transition-all duration-150 placeholder:text-ink-2/50 border ${
                  errors.category
                    ? 'border-2 border-red focus:border-red focus:ring-2 focus:ring-red/20'
                    : 'border border-border focus:border-accent focus:ring-2 focus:ring-accent/20'
                }`}
              >
                <option value="">Select category</option>
                <option value="books">Books & Educational Materials</option>
                <option value="furniture">Furniture & Fixtures</option>
                <option value="technology">Technology & Equipment</option>
                <option value="supplies">School Supplies</option>
                <option value="infrastructure">Infrastructure & Facilities</option>
                <option value="sports">Sports & Recreation</option>
                <option value="other">Other</option>
              </select>
              {errors.category && (
                <p className="font-sans mt-1 text-xs text-red">
                  {errors.category.message || 'This field is required'}
                </p>
              )}
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
            <Button
              type="submit"
              className="w-full"
              loading={submitting}
              disabled={submitting}
            >
              {submitting ? 'Submitting...' : 'Add Requirement'}
            </Button>
          </form>
        </Card>

        {/* Info Card */}
        <Card className="mt-8 bg-surface-2 border-0">
          <div className="mb-4">
            <h3 className="font-display text-lg font-semibold text-ink">
              💡 Tips for Effective Requirements
            </h3>
          </div>
          
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent text-white text-xs font-bold">
                1
              </div>
              <div>
                <h4 className="font-sans text-sm font-medium text-ink">
                  Be Specific
                </h4>
                <p className="font-sans mt-1 text-xs text-ink-2">
                  Include exact specifications, models, or quantities needed
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent text-white text-xs font-bold">
                2
              </div>
              <div>
                <h4 className="font-sans text-sm font-medium text-ink">
                  Set Clear Priority
                </h4>
                <p className="font-sans mt-1 text-xs text-ink-2">
                  Help donors understand urgency and impact level
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent text-white text-xs font-bold">
                3
              </div>
              <div>
                <h4 className="font-sans text-sm font-medium text-ink">
                  Explain Impact
                </h4>
                <p className="font-sans mt-1 text-xs text-ink-2">
                  Describe how this requirement will benefit students
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 rounded-md bg-green-light p-4">
            <h4 className="font-sans text-sm font-medium text-green mb-2">
              🎯 Why Requirements Matter
            </h4>
            <ul className="font-sans text-xs text-green space-y-1">
              <li>• Connect donors directly to specific school needs</li>
              <li>• Enable targeted support for maximum impact</li>
              <li>• Help volunteers understand how they can help best</li>
              <li>• Create transparency in resource allocation</li>
            </ul>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}

