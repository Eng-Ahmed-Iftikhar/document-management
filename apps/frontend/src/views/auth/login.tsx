// next
import NextLink from 'next/link';

// material-ui
import Grid from '@mui/material/Grid'; // Ensure this is the correct import for MUI v5
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project import
import AuthWrapper from 'sections/auth/AuthWrapper';
import AuthLogin from 'sections/auth/auth-forms/AuthLogin';

export default async function   SignIn() {


  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid size={{xs:12}}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Login</Typography>
            <NextLink href="/register" passHref legacyBehavior>
              <Link variant="body1" color="primary">
                Don&apos;t have an account?
              </Link>
            </NextLink>
          </Stack>
        </Grid>
        <Grid size={{xs:12}}>
          <AuthLogin   />
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
