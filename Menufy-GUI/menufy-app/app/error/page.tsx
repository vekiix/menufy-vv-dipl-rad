'use client'

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Suspense } from 'react';

const ErrorContent = () => {
  const searchParams = useSearchParams();

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'CredentialsSignin':
        return 'Invalid username or password. Please try again.';
      case 'AccessDenied':
        return 'Access denied. You do not have permission to access this resource.';
      case 'Verification':
        return 'Verification failed. Please try again.';
      default:
        return 'An authentication error occurred. Please try again.';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="bg-white p-10 rounded-lg shadow-2xl w-full max-w-md text-center">
        <h1 className="text-4xl font-bold text-red-600 mb-4">⚠️ Error</h1>
        <p className="text-gray-700 mb-6">
          {getErrorMessage(searchParams.get('error'))}
        </p>
        <div className="space-y-3">
          <Link href="/login">
            <Button className="w-full">
              Back to Login
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="w-full">
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const ErrorPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="bg-white p-10 rounded-lg shadow-2xl w-full max-w-md text-center">
          <h1 className="text-4xl font-bold text-red-600 mb-4">⚠️ Error</h1>
          <p className="text-gray-700 mb-6">Loading...</p>
        </div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
};

export default ErrorPage;




