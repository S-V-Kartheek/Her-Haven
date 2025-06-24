import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the type for the user data
interface UserData {
  name: string;
  email: string;
  // Add other user properties as needed
}

// Define the type for the Auth Context value
interface AuthContextType {
  user: UserData | null;
  login: (userData: UserData) => void;
  logout: () => void;
}

// Create the Auth Context with a default value
const AuthContext = createContext<AuthContextType | null>(null);

// Create the Auth Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  // Initialize user state from localStorage
  const [user, setUser] = useState<UserData | null>(() => {
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error('Error reading user from localStorage:', error);
      return null;
    }
  });

  // Function to handle login
  const login = (userData: UserData) => {
    setUser(userData);
    // Store user data in localStorage
    try {
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  };

  // Function to handle logout
  const logout = () => {
    setUser(null);
    // Remove user data from localStorage
    try {
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Error removing user from localStorage:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the Auth Context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 