import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import Card from '../components/Card.jsx'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'
import { authService } from '../services/authService.js'

export default function Register() {
  const { register, handleSubmit, watch, setValue, formState } = useForm({
    defaultValues: {
      role: 'donor',
      schoolDetails: {
        name: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        udiseCode: '',
        schoolType: 'government',
      },
      contactPerson: {
        name: '',
        role: '',
        phone: '',
      },
      verification: {
        documentUrl: '',
      },
    },
  })
  const { errors } = formState
  const [serverError, setServerError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const role = watch('role')

  const onSubmit = async (values) => {
    setSubmitting(true)
    setServerError('')
    setSuccess('')
    try {
      if (values.role === 'school') {
        const payload = {
          email: values.email,
          password: values.password,
          schoolDetails: values.schoolDetails,
          contactPerson: values.contactPerson,
          verification: values.verification,
        }
        await authService.schoolRegister(payload)
      } else if (values.role === 'volunteer') {
        await authService.volunteerRegister(values)
      } else {
        await authService.register(values)
      }
      setSuccess('Account created. You can now login.')
      setTimeout(() => navigate('/login'), 900)
    } catch (error) {
      const data = error.response?.data
      const firstValidatorError =
        Array.isArray(data?.errors) && data.errors.length
          ? data.errors[0]?.msg
          : ''

      setServerError(
        data?.message ||
          firstValidatorError ||
          'Unable to register. Please review your details.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Left Panel - Brand */}
      <div className="hidden w-2/5 bg-gradient-to-br from-accent to-accent-light lg:block">
        <div className="flex h-full flex-col justify-center px-12">
          <div className="mb-8">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white text-lg font-bold text-accent">
                ER
              </div>
              <span className="font-display text-2xl font-semibold text-white">
                EduReach
              </span>
            </div>
            <blockquote className="font-display text-2xl font-medium text-white/90 leading-relaxed">
              "The function of education is to teach one to think intensively and to think critically."
            </blockquote>
            <cite className="font-sans mt-4 block text-sm text-white/70">
              — Martin Luther King Jr.
            </cite>
          </div>
          
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div 
              className="h-full w-full" 
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='7'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 lg:px-12">
        <div className="w-full max-w-lg">
          <Card className="border-0 shadow-elevated">
            <div className="mb-8 text-center">
              <h1 className="font-display text-3xl font-semibold text-ink mb-2">
                Create an account
              </h1>
              <p className="font-sans text-sm text-ink-2">
                Choose your role and start supporting education
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Role Switcher */}
              <div className="flex justify-center">
                <div className="inline-flex rounded-lg border border-border bg-surface p-1">
                  {['donor', 'school', 'volunteer'].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => {
                        setValue('role', r, {
                          shouldDirty: true,
                          shouldTouch: true,
                          shouldValidate: true,
                        })
                      }}
                      className={`rounded-md px-4 py-2 font-sans text-sm font-medium capitalize transition-all ${
                        role === r
                          ? 'bg-accent text-white shadow-sm'
                          : 'text-ink-2 hover:text-ink'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <input type="hidden" {...register('role')} />

              <Input
                label={role === 'school' ? 'School name' : 'Name'}
                name={role === 'school' ? 'schoolDetails.name' : 'name'}
                register={register}
                error={role === 'school' ? errors.schoolDetails?.name : errors.name}
                required
              />
              <Input
                label="Email"
                name="email"
                type="email"
                register={register}
                error={errors.email}
                required
              />
              <Input
                label="Password"
                name="password"
                type="password"
                register={register}
                error={errors.password}
                required
              />

              {role !== 'school' && (
                <Input
                  label="Phone"
                  name="phone"
                  register={register}
                  error={errors.phone}
                  inputMode="numeric"
                  placeholder="10 digits"
                  required
                />
              )}

              {role === 'school' && (
                <div className="rounded-lg bg-surface-2 p-4">
                  <h3 className="font-display mb-4 text-sm font-semibold text-ink">
                    School Information
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Input
                        label="UDISE code"
                        name="schoolDetails.udiseCode"
                        register={register}
                        error={errors.schoolDetails?.udiseCode}
                        required
                      />
                      <Input
                        label="Contact person phone"
                        name="contactPerson.phone"
                        register={register}
                        error={errors.contactPerson?.phone}
                        inputMode="numeric"
                        placeholder="10 digits"
                        required
                      />
                    </div>
                    <Input
                      label="Contact person name"
                      name="contactPerson.name"
                      register={register}
                      error={errors.contactPerson?.name}
                      required
                    />
                  </div>
                </div>
              )}

              {serverError && (
                <div className="rounded-md bg-red-light p-3">
                  <p className="font-sans text-sm text-red">{serverError}</p>
                </div>
              )}
              {success && (
                <div className="rounded-md bg-green-light p-3">
                  <p className="font-sans text-sm text-green">{success}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                loading={submitting}
                disabled={submitting}
              >
                {submitting ? 'Creating account…' : 'Register'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="font-sans text-sm text-ink-2">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-accent hover:text-accent/90">
                  Login
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

