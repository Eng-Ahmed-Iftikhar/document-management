import { ReactElement } from 'react';

// material-ui
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

// project import
import AuthCard from './AuthCard';
import AuthBackground from './AuthBackground';
// import AuthFooter from 'components/cards/AuthFooter';
import Logo from 'components/logo';
import { Typography } from '@mui/material';

interface Props {
  children: ReactElement;
}

// ==============================|| AUTHENTICATION - WRAPPER ||============================== //

export default function AuthWrapper({ children }: Props) {
  return (
    <Box sx={{ minHeight: '100vh' }}>
      <AuthBackground />
      <Grid
        container
        direction="column"
        justifyContent="flex-end"
        sx={{ minHeight: '100vh' }}
      >
        <Grid size={{ xs: 12 }} sx={{ ml: 3, mt: 3 }}>
          <Box display="flex" alignItems="center">
            <Logo /> <Typography variant="h4">Document management</Typography>
          </Box>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Grid
            size={{ xs: 12 }}
            container
            justifyContent="center"
            alignItems="center"
            sx={{
              minHeight: {
                xs: 'calc(100vh - 210px)',
                sm: 'calc(100vh - 134px)',
                md: 'calc(100vh - 112px)',
              },
            }}
          >
            <Grid>
              <AuthCard>{children}</AuthCard>
            </Grid>
          </Grid>
        </Grid>
        {/* <Grid size={{ xs: 12 }} sx={{ m: 3, mt: 1 }}>
          <AuthFooter />
        </Grid> */}
      </Grid>
    </Box>
  );
}
