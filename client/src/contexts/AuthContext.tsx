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
  logout: () => void;
  redirectPath: string | null;
  setRedirectPath: (path: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock authentication for admin accounts
    if (username === 'admin' && password === '12345') {
      const userData: User = {
        id: '1',
        name: '관리자',
        email: 'admin@allthatprinting.com',
        points: 50000,
        coupons: 10,
        totalOrders: 50,
        totalSpent: 1000000,
        isAdmin: true,
        firstName: '관리자',
        lastName: ''
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    }
    
    if (username === 'superadmin' && password === '12345') {
      const userData: User = {
        id: '2',
        name: '슈퍼관리자',
        email: 'superadmin@allthatprinting.com',
        points: 100000,
        coupons: 20,
        totalOrders: 100,
        totalSpent: 2000000,
        isAdmin: true,
        firstName: '슈퍼관리자',
        lastName: ''
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    }
    
    // Regular user accounts
    if (username === 'user1' && password === '12345') {
      const userData: User = {
        id: '3',
        name: '일반회원',
        email: 'user1@example.com',
        points: 5000,
        coupons: 3,
        totalOrders: 10,
        totalSpent: 150000,
        isAdmin: false,
        firstName: '일반',
        lastName: '회원'
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    setRedirectPath(null);
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