import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  username?: string;
  email: string;
  points: number;
  coupons: number;
  totalOrders: number;
  totalSpent: number;
  isAdmin: boolean;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  redirectPath: string | null;
  setRedirectPath: (path: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in with JWT token
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include', // Include cookies
        });
        
        if (response.ok) {
          const userData = await response.json();
          const user: User = {
            id: userData.id.toString(),
            name: `${userData.first_name} ${userData.last_name}`.trim(),
            username: userData.username,
            email: userData.email,
            points: 0,
            coupons: 0,
            totalOrders: 0,
            totalSpent: 0,
            isAdmin: userData.is_admin,
            firstName: userData.first_name,
            lastName: userData.last_name || ''
          };
          setUser(user);
        } else {
          // Clear any existing user data
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        const user: User = {
          id: userData.id.toString(),
          name: `${userData.first_name} ${userData.last_name}`.trim(),
          username: userData.username,
          email: userData.email,
          points: 0,
          coupons: 0,
          totalOrders: 0,
          totalSpent: 0,
          isAdmin: userData.is_admin,
          firstName: userData.first_name,
          lastName: userData.last_name || ''
        };
        
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));
        setIsLoading(false);
        return true;
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
    setIsLoading(false);
    return false;
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include', // Include cookies
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('user');
      setRedirectPath(null);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      redirectPath,
      setRedirectPath
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}