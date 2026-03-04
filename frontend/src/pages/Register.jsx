import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card.jsx'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'
import { authService } from '../services/authService.js'

export default function Register() {
  const { register, handleSubmit, watch, formState } = useForm({
    defaultValues: { role: 'donor' },
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
        await authService.schoolRegister(values)
      } else if (values.role === 'volunteer') {
        await authService.volunteerRegister(values)
      } else {
        await authService.register(values)
      }
      setSuccess('Account created. You can now login.')
      setTimeout(() => navigate('/login'), 900)
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          'Unable to register. Please review your details.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Card
          title="Create an account"
          description="Choose your role and start supporting education."
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['donor', 'school', 'volunteer'].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    // eslint-disable-next-line react-hooks/rules-of-hooks
                    register('role').onChange({ target: { value: r } })
                  }}
                  className={`rounded-lg border px-3 py-2 capitalize ${
                    role === r
                      ? 'border-slate-900 bg-slate-900 text-white'
                      : 'border-slate-200 bg-white text-slate-700'
                  }`}
                >
                  {r}
                </button>
              ))}
              <input type="hidden" {...register('role')} />
            </div>

            <Input
              label="Name"
              name="name"
              register={register}
              error={errors.name}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              register={register}
              error={errors.email}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              register={register}
              error={errors.password}
            />

            {serverError && (
              <p className="text-xs text-red-500">{serverError}</p>
            )}
            {success && (
              <p className="text-xs text-emerald-600">{success}</p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? 'Creating account…' : 'Register'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

