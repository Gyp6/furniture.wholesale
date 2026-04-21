'use client';

import { useState } from 'react';

import { authClient } from '@/lib/auth.client';

export default function Home() {
  const { data: session, isPending: isLoading } = authClient.useSession();
  const [activeForm, setActiveForm] = useState<'signin' | 'signup'>('signin');

  if (isLoading) {
    return (
      <div className={'flex justify-center items-center min-h-screen'}>
        Loading...
      </div>
    );
  }

  if (session) {
    return (
      <div className={'container mx-auto px-4 py-8'}>
        <div className={'max-w-md mx-auto text-center'}>
          <h1 className='text-3xl font-bold mb-4'>Welcome!</h1>
          <p className='mb-4'>You are signed in as: {session.user.name}</p>

          <button
            onClick={() => authClient.signOut()}
            className='bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700'
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='flex justify-center mb-8'>
        <div className='bg-gray-100 p-1 rounded-lg'>
          <button
            onClick={() => setActiveForm('signin')}
            className={`py-2 px-4 rounded-md ${
              activeForm === 'signin'
                ? 'bg-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Sign In
          </button>

          <button
            onClick={() => setActiveForm('signup')}
            className={`py-2 px-4 rounded-md ${
              activeForm === 'signup'
                ? 'bg-white shadow-sm'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
