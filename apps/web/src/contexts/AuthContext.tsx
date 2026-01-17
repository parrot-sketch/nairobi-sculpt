import { useState, createContext, useContext } from 'react';
import type { ReactNode } from 'react';

export type UserRole = 'PATIENT' | 'DOCTOR' | 'FRONTDESK' | 'ADMIN';

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('auth_token'));
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { getApiUrl } = await import('@/utils/getApiUrl');
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || 'Login failed';

        // Provide specific error messages based on status
        if (response.status === 401) {
          throw new Error('Invalid email or password. Please try again.');
        } else if (response.status === 500) {
          throw new Error('Service temporarily unavailable. Please try again later.');
        } else if (response.status === 503) {
          throw new Error('Service is under maintenance. Please try again later.');
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('auth_token', data.token);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
  };

  const signup = async (
    email: string,
    password: string,
    name: string,
    role: UserRole,
  ) => {
    setIsLoading(true);
    try {
      const { getApiUrl } = await import('@/utils/getApiUrl');
      const apiUrl = getApiUrl();
      const response = await fetch(`${apiUrl}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name, role }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.message || 'Signup failed';

        if (response.status === 400) {
          throw new Error(
            errorMessage.includes('already')
              ? 'Email address already in use. Please login instead.'
              : 'Invalid signup information. Please check your details.',
          );
        } else if (response.status === 500) {
          throw new Error('Service temporarily unavailable. Please try again later.');
        } else if (response.status === 503) {
          throw new Error('Service is under maintenance. Please try again later.');
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('auth_token', data.token);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
