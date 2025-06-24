'use client';
import { useSession } from 'next-auth/react';
import { createContext, ReactElement, useEffect, useState } from 'react';

// project import

// types
import { AuthContextProps, User } from 'types/auth';
import axiosServices from 'utils/axios';

// initial state
const initialState: AuthContextProps = {
  user: null,
  isAuthenticated: false,
  isVerified: false,
  updateUser: () => {
    console.log('not implemented');
  },
};

// ==============================|| CONFIG CONTEXT & PROVIDER ||============================== //

const AuthContext = createContext(initialState);

type ConfigProviderProps = {
  children: ReactElement;
};

function AuthProvider({ children }: ConfigProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const session = useSession();

  useEffect(() => {
    if (session?.status !== 'authenticated') return;
    axiosServices
      .get('/auth/me')
      .then((response) => {
        setUser(response.data.data.user);
        setIsAuthenticated(true);
        setIsVerified(response.data.data.user.is_verified);
      })
      .catch(() => {
        setUser(null);
        setIsAuthenticated(false);
        setIsVerified(false);
      });
  }, [session]);

  const updateUser = (user: User) => {
    setUser(user);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isVerified,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
