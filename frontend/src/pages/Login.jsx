import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
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
    <div className="flex min-h-screen bg-bg">
      {/* Left Panel - Brand */}
      <div className="relative hidden w-2/5 bg-gradient-to-br from-accent to-accent-light lg:block">
        <div className="relative z-10 flex h-full flex-col justify-center px-12">
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
              "Education is the most powerful weapon which you can use to change the world."
            </blockquote>
            <cite className="font-sans mt-4 block text-sm text-white/70">
              — Nelson Mandela
            </cite>
          </div>
          
          {/* Pattern Overlay */}
          <div className="pointer-events-none absolute inset-0 z-0 opacity-10">
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
                Welcome back
              </h1>
              <p className="font-sans text-sm text-ink-2">
                Sign in to access your EduReach dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              
              {serverError && (
                <div className="rounded-md bg-red-light p-3">
                  <p className="font-sans text-sm text-red">{serverError}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                loading={submitting}
                disabled={submitting}
              >
                {submitting ? 'Signing in…' : 'Login'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="font-sans text-sm text-ink-2">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-accent hover:text-accent/90">
                  Register
                </Link>
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

