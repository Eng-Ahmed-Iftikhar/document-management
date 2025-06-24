'use client';

import { useEffect } from 'react';

// next
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// project-import
import Loader from 'components/Loader';

// types
import { GuardProps } from 'types/auth';
import useUser from 'hooks/useUser';

// ==============================|| AUTH GUARD ||============================== //

export default function AuthGuard({ children }: GuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/auth/protected');
      const json = await res?.json();
      if (!json?.protected) {
        router.push('/login');
      }
    };
    fetchData();

    // eslint-disable-next-line
  }, [session]);

  useEffect(() => {
    if (user && !user?.is_verified) {
      router.push('/verify-email');
    }
  }, [router, user]);

  if (status === 'loading' || !session?.user || !user) return <Loader />;

  return children;
}
