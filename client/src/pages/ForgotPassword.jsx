import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiMail, FiArrowLeft } from 'react-icons/fi'
import { Helmet } from 'react-helmet-async'
import { forgotPassword } from '../services/api'
import { toast } from 'react-toastify'

const ForgotPassword = () => {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Validation
    if (!email.trim()) {
      toast.error('Please enter your email address')
      setLoading(false)
      return
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address')
      setLoading(false)
      return
    }

    try {
      await forgotPassword(email)
      setSubmitted(true)
      toast.success('If an account with that email exists, a password reset link has been sent.')
    } catch (error) {
      toast.error('An error occurred. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <Helmet>
        <title>Forgot Password | AliRwanda</title>
        <meta name="description" content="Reset your AliRwanda password" />
        <link rel="canonical" href="https://alirwanda.com/forgot-password" />
      </Helmet>
      <div className="max-w-md w-full">
        <div className="card p-8">
          <div className="text-center mb-8">
            <Link
              to="/login"
              className="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-secondary dark:hover:text-secondary mb-4"
            >
              <FiArrowLeft className="w-5 h-5 mr-2" />
              Back to Login
            </Link>
            <h2 className="text-3xl font-bold text-primary dark:text-white mb-2">
              Forgot Password
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMail className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Check Your Email
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                If an account with that email exists, a password reset link has been sent to your email address.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                The link will expire in 15 minutes for your security.
              </p>
              <Link
                to="/login"
                className="btn-primary inline-block"
              >
                Back to Login
              </Link>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Remember your password?{' '}
              <Link to="/login" className="text-secondary hover:text-orange-600 font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword
