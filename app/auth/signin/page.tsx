import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import SignInForm from './SignInForm';

export const metadata: Metadata = {
  title: 'Sign In - Travel Photo Blog Admin',
  description: 'Sign in to access the admin dashboard',
};

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Sign in to access your admin dashboard
            </p>
          </div>

          {/* Sign In Form */}
          <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
            <SignInForm />
          </Suspense>

          {/* Footer */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-sm text-indigo-600 hover:text-indigo-500"
            >
              ← Back to website
            </Link>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <p className="font-medium mb-1">First time signing in?</p>
          <p className="text-blue-600">
            Use the email configured in your .env.local file or sign in with Google
            if OAuth is set up.
          </p>
        </div>
      </div>
    </div>
  );
}
