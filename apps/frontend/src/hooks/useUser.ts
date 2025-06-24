import { AuthContext } from 'contexts/AuthContext';
import { useContext } from 'react';

export default function useUser() {
  return useContext(AuthContext);
}
