'use client'

import { useState, useTransition } from 'react'

// Action function (will be easy to convert to server action in React 19)
async function subscribeToNewsletter(email: string) {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Validation
  if (!email || !/^[\w.!#$%&'*+/=?`{|}~-]+@[\w-]+\.[\w.-]+$/i.test(email)) {
    return { 
      success: false, 
      message: 'Pop in a valid email and we\'ll keep you in the loop.' 
    }
  }
  
  // TODO: Replace with actual API call when backend is ready
  // const response = await fetch('/api/newsletter', { method: 'POST', body: JSON.stringify({ email }) })
  
  return { 
    success: true, 
    message: 'Thanks! We\'ll send our next travel drop soon.' 
  }
}

export default function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    
    startTransition(async () => {
      const result = await subscribeToNewsletter(email)
      
      if (result.success) {
        setStatus('success')
        setMessage(result.message)
        setEmail('')
      } else {
        setStatus('error')
        setMessage(result.message)
      }
    })
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
            disabled={isPending}
          />
          <button 
            type="submit" 
            className="btn btn-primary sm:w-auto" 
            disabled={isPending}
          >
            {isPending ? 'Subscribing...' : 'Join list'}
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
