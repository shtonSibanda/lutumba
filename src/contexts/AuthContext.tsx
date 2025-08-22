import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AuthState, LoginCredentials, RegisterData } from '../types';

// Admin user credentials
const adminUser: User = {
  id: '1',
  email: 'lutumba@gmail.com',
  name: 'Admin User',
  role: 'admin',
};

const ADMIN_PASSWORD = 'Adventist#25';


type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check for stored user on app load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Validate admin credentials
      if (credentials.email !== adminUser.email) {
        throw new Error('Invalid email or password');
      }

      if (credentials.password !== ADMIN_PASSWORD) {
        throw new Error('Invalid email or password');
      }

      const user = adminUser;

      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error instanceof Error ? error.message : 'Login failed' 
      });
    }
  };

  const register = async (data: RegisterData) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists (only admin user exists)
      if (data.email === adminUser.email) {
        throw new Error('User with this email already exists');
      }

      // Validate password confirmation
      if (data.password !== data.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (data.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        email: data.email,
        name: data.name,
        role: data.role,
      };

      // In a real app, you would send this to the backend
      // For demo purposes, we'll just log in the new user
      localStorage.setItem('user', JSON.stringify(newUser));
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: newUser });
    } catch (error) {
      dispatch({ 
        type: 'LOGIN_FAILURE', 
        payload: error instanceof Error ? error.message : 'Registration failed' 
      });
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 