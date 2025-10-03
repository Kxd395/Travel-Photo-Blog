import { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Authentication Error - Travel Photo Blog',
  description: 'An error occurred during authentication',
};

function ErrorContent() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-100 px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Error Icon */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          {/* Message */}
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Authentication Error
          </h1>
          <p className="text-gray-600 mb-6 text-center">
            We encountered an issue while trying to sign you in.
          </p>

          {/* Common Issues */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="font-medium text-gray-900 mb-2">Common issues:</p>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>Email is not authorized in the system</li>
              <li>OAuth provider configuration issue</li>
              <li>Network or server error</li>
              <li>Session expired</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              href="/auth/signin"
              className="block w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium text-center"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="block w-full px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-center"
            >
              Back to Website
            </Link>
          </div>
        </div>

        {/* Help Box */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <p className="font-medium mb-1">Need help?</p>
          <p className="text-blue-600">
            Contact your administrator or check the server logs for more details.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ErrorContent />
    </Suspense>
  );
}
