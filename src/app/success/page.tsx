"use client"

import { useAuth } from '@/context/authContext';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const SuccessPage = () => {
  const { user, signOutUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <main className='flex flex-col gap-10 items-center justify-center min-h-screen'>
      <div>Login feito</div>
      <button onClick={signOutUser} className='bg-red-500 px-5 py-3 rounded-md text-white'>Sair</button>
    </main>
  );
};

export default SuccessPage;
