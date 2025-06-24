import { ReactElement } from 'react';

// ==============================|| AUTH TYPES ||============================== //

export type GuardProps = {
  children: ReactElement | null;
};

export type UserProfile = {
  id: number;
  user_id: number;
  bio: string;
  profile_img: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
};

export type User = {
  id: number;
  email: string;
  username: string;
  is_active: boolean;
  is_verified: boolean;
  role: string;
  created_at: string;
  updated_at: string;
  profile: UserProfile;
};

export type AuthContextProps = {
  user: User | null;
  isAuthenticated: boolean;
  isVerified: boolean;
  updateUser: (user: User) => void;
};
