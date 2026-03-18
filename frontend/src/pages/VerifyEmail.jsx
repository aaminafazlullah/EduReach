import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import Card from '../components/Card.jsx'
import Input from '../components/Input.jsx'
import Button from '../components/Button.jsx'
import { authService } from '../services/authService.js'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { register, handleSubmit, formState } = useForm()
  const { errors } = formState

  const [loading, setLoading] = useState(true)
  const [successMessage, setSuccessMessage] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showResendForm, setShowResendForm] = useState(false)

  // Auto-verify token from URL on mount
  useEffect(() => {
    const token = searchParams.get('token')

    if (token) {
      autoVerify(token)
    } else {
      setLoading(false)
      setError('No verification link provided. Please request a new email.')
    }
  }, [searchParams])

  const autoVerify = async (token) => {
    setLoading(true)
    setError('')
    try {
      const { data } = await authService.verifyEmail(token)
      setSuccessMessage('Email verified successfully! Redirecting to login...')

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 2000)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Verification failed. Please resend the email.'
      )
      setLoading(false)
    }
  }

  const onSubmitResend = async (values) => {
    setSubmitting(true)
    setError('')
    try {
      await authService.resendVerificationEmail(values.email)
      setSuccessMessage(
        'Verification email sent! Check your inbox for the new link.'
      )
      setShowResendForm(false)
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Unable to resend email. Please try again.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        {/* Loading State */}
        {loading && (
          <Card title="Verifying Email" description="Please wait...">
            <div className="flex justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-900"></div>
            </div>
          </Card>
        )}

        {/* Success State */}
        {!loading && successMessage && (
          <Card
            title="Success!"
            description="Your email has been verified."
          >
            <div className="space-y-4">
              <p className="text-sm text-green-600">{successMessage}</p>
            </div>
          </Card>
        )}

        {/* Error State with Resend Option */}
        {!loading && !successMessage && error && !showResendForm && (
          <Card
            title="Verification Failed"
            description="We couldn't verify your email"
          >
            <div className="space-y-4">
              <div className="rounded-lg bg-red-50 p-3">
                <p className="text-xs text-red-600">{error}</p>
              </div>

              <Button
                className="w-full"
                onClick={() => setShowResendForm(true)}
                disabled={submitting}
              >
                {submitting ? 'Sending…' : 'Resend Verification Email'}
              </Button>
            </div>
          </Card>
        )}

        {/* Resend Email Form */}
        {showResendForm && (
          <Card
            title="Resend Verification Email"
            description="Enter your email address"
          >
            <div className="space-y-4">
              {error && (
                <div className="rounded-lg bg-red-50 p-3">
                  <p className="text-xs text-red-600">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmitResend)} className="space-y-4">
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  register={register}
                  error={errors.email}
                />

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowResendForm(false)}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={submitting}
                  >
                    {submitting ? 'Sending…' : 'Resend Email'}
                  </Button>
                </div>

                {successMessage && (
                  <div className="rounded-lg bg-green-50 p-3">
                    <p className="text-xs text-green-600">{successMessage}</p>
                  </div>
                )}
              </form>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
