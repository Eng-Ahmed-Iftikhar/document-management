'use client';
// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useUser from 'hooks/useUser';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// project import
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthCodeVerification from 'sections/auth/auth-forms/AuthCodeVerification';

// ================================|| CODE VERIFICATION ||================================ //

export default function CodeVerification() {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user?.is_verified) {
      router.push('/');
    }
  }, [user, router]);

  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <Stack spacing={1}>
            <Typography variant="h3">Enter Verification Code</Typography>
            <Typography color="secondary">We send you on mail.</Typography>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography>We`ve send you code on {user?.email}</Typography>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <AuthCodeVerification />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
