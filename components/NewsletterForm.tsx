'use client'

import { useState } from 'react'

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email || !/^[\w.!#$%&'*+/=?`{|}~-]+@[\w-]+\.[\w.-]+$/i.test(email)) {
      setStatus('error')
      setMessage('Pop in a valid email and we\'ll keep you in the loop.')
      return
    }
    setStatus('success')
    setMessage('Thanks! We\'ll send our next travel drop soon.')
    setEmail('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="newsletter-email" className="block mb-2">
          Get our next adventure update
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id="newsletter-email"
            type="email"
            inputMode="email"
            required
            placeholder="you@example.com"
            value={email}
            onChange={event => {
              setEmail(event.target.value)
              if (status !== 'idle') {
                setStatus('idle')
                setMessage('')
              }
            }}
            className="flex-1"
            aria-describedby="newsletter-helper"
          />
          <button type="submit" className="btn btn-primary sm:w-auto">
            Join list
          </button>
        </div>
        <p id="newsletter-helper" className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Low-key updates when we add new city guides and photo drops.
        </p>
      </div>

      {status === 'error' && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">{message}</p>
      )}
      {status === 'success' && (
        <p className="text-sm text-green-600 dark:text-green-400" role="status">{message}</p>
      )}
    </form>
  )
}
