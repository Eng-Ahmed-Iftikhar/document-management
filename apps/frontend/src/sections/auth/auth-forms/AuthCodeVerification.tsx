'use client';

import { useCallback, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// third-party
import OtpInput from 'react18-input-otp';

// project import
import AnimateButton from 'components/@extended/AnimateButton';
import axiosServices from 'utils/axios';
import { openSnackbar } from 'api/snackbar';
import { SnackbarProps } from 'types/snackbar';
import useUser from 'hooks/useUser';
import { useRouter } from 'next/navigation';
import { User } from 'types/auth';

// ============================|| STATIC - CODE VERIFICATION ||============================ //

export default function AuthCodeVerification() {
  const theme = useTheme();
  const [otp, setOtp] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const { user, updateUser } = useUser();
  const router = useRouter();
  const borderColor = theme.palette.divider;

  const sendVerificationCode = useCallback(async () => {
    try {
      await axiosServices.post('/auth/send-verification-email', {
        email: user?.email,
      });

      openSnackbar({
        open: true,
        message: 'Verification code is sent to your email.',
        variant: 'alert',
        alert: {
          color: 'success',
        },
      } as SnackbarProps);
    } catch (error) {
      openSnackbar({
        open: true,
        message: "Verification code couldn't be sent.",
        variant: 'alert',
        alert: {
          color: 'error',
        },
      } as SnackbarProps);
    }
  }, [user]);

  const verifyEmailCode = useCallback(async () => {
    try {
      setLoading(true);

      await axiosServices.post('/auth/verify-email', {
        code: otp,
      });
      openSnackbar({
        open: true,
        message: 'Email is verified.',
        variant: 'alert',
        alert: {
          color: 'success',
        },
      } as SnackbarProps);
      updateUser({ ...(user as User), is_verified: true });
      router.push('/');
    } catch (error) {
      openSnackbar({
        open: true,
        message: "Verification code couldn't be verified.",
        variant: 'alert',
        alert: {
          color: 'error',
        },
      } as SnackbarProps);
    } finally {
      setLoading(false);
    }
  }, [otp, router, updateUser, user]);

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <OtpInput
          value={otp}
          onChange={(newOtp: string) => setOtp(newOtp)}
          numInputs={4}
          containerStyle={{ justifyContent: 'space-between' }}
          inputStyle={{
            width: '100%',
            margin: '8px',
            padding: '10px',
            border: '1px solid',
            borderColor: borderColor,
            borderRadius: 4,
            ':hover': { borderColor: theme.palette.primary.main },
          }}
          focusStyle={{
            outline: 'none',
            boxShadow: theme.customShadows.primary,
            border: '1px solid',
            borderColor: theme.palette.primary.main,
          }}
        />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <AnimateButton>
          <Button
            onClick={verifyEmailCode}
            loading={loading}
            disableElevation
            fullWidth
            size="large"
            type="submit"
            variant="contained"
          >
            Continue
          </Button>
        </AnimateButton>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="baseline"
        >
          <Typography>
            Did not receive the email? Check your spam filter, or
          </Typography>
          <Button variant="text" onClick={sendVerificationCode}>
            <Typography
              variant="body1"
              sx={{
                minWidth: 85,
                ml: 2,
                textDecoration: 'none',
                cursor: 'pointer',
              }}
              color="primary"
            >
              Resend code
            </Typography>
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
}
