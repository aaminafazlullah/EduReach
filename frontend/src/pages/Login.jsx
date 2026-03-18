import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import { authService } from '../services/authService.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { register, handleSubmit, formState } = useForm()
  const { errors } = formState
  const [serverError, setServerError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const onSubmit = async (values) => {
    setSubmitting(true)
    setServerError('')
    try {
      const { data } = await authService.login(values)
      const { token, role, userId, emailVerified } = data
      login({ token, role, userId, emailVerified })

      if (role === 'admin') navigate('/admin', { replace: true })
      else if (role === 'donor') navigate('/donor', { replace: true })
      else if (role === 'school') navigate('/school', { replace: true })
      else if (role === 'volunteer') navigate('/volunteer', { replace: true })
      else navigate('/', { replace: true })
    } catch (error) {
      setServerError(
        error.response?.data?.message ||
          'Unable to login. Please check your credentials.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <Card
          title="Welcome back"
          description="Sign in to access your EduReach dashboard."
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <Button
              type="submit"
              className="w-full"
              disabled={submitting}
            >
              {submitting ? 'Signing in…' : 'Login'}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}

