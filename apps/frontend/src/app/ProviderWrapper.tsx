'use client';

import { ReactNode } from 'react';

// next
import { SessionProvider } from 'next-auth/react';

// project import
import ThemeCustomization from 'themes';

import Locales from 'components/Locales';
import ScrollTop from 'components/ScrollTop';
// import RTLLayout from 'components/RTLLayout';
import Snackbar from 'components/@extended/Snackbar';
import Notistack from 'components/third-party/Notistack';
import { AuthProvider } from 'contexts/AuthContext';
import { ReduxPersisted } from 'store';

// import { ConfigProvider } from 'contexts/ConfigContext';

// ==============================|| APP - THEME, ROUTER, LOCAL ||============================== //

export default function ProviderWrapper({ children }: { children: ReactNode }) {
  return (
    // <ConfigProvider>
    <ThemeCustomization>
      <ReduxPersisted>
        <Locales>
          <ScrollTop>
            <SessionProvider refetchInterval={0}>
              <AuthProvider>
                <Notistack>
                  <Snackbar />
                  {children}
                </Notistack>
              </AuthProvider>
            </SessionProvider>
          </ScrollTop>
        </Locales>
      </ReduxPersisted>
      {/* <RTLLayout> */}

      {/* </RTLLayout> */}
    </ThemeCustomization>
    // {/* </ConfigProvider> */}
  );
}
