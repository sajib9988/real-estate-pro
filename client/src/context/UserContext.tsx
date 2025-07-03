'use client';


import { TUser } from '@/lib/type';
import { getCurrentUser } from '@/service/auth';



import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';

interface IUserProv {
  user: TUser | null;
  isLoading: boolean;
  setUser: (user: TUser | null) => void;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}
export const UserContext = createContext<IUserProv | undefined>(undefined);

const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<TUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleUser = async () => {
    const user = await getCurrentUser();
    setUser(user);
    console.log('User from context:', user);
    setIsLoading(false);
  };

  useEffect(() => {
    handleUser();
  }, []); // Empty dependency array

  return (
    <UserContext.Provider value={{ user, setUser, isLoading, setIsLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (context == undefined) {
    throw new Error('useUser must be used within the UserProvider context');
  }

  return context;
};
export default UserProvider;