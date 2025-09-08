
import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';

// NOTE: This is a mock authentication system for demonstration purposes.
// In a real application, you would use a secure backend service and Google's SDK.

interface RawUser extends User {
    password_hash: string; // "Hashed" password for simulation
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password_raw: string) => Promise<void>;
  signup: (email: string, password_raw: string, role: UserRole) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'gemini-job-portal-users';
const SESSION_STORAGE_KEY = 'gemini-job-portal-session';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const sessionData = localStorage.getItem(SESSION_STORAGE_KEY);
      if (sessionData) {
        setUser(JSON.parse(sessionData));
      }
    } catch (error) {
      console.error("Failed to parse session data from localStorage", error);
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } finally {
        setLoading(false);
    }
  }, []);

  const getStoredUsers = (): RawUser[] => {
    try {
        const usersData = localStorage.getItem(USERS_STORAGE_KEY);
        if (usersData) {
            return JSON.parse(usersData);
        }
        return [];
    } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        return [];
    }
  };
  
  // Seed with demo accounts if none exist
  useEffect(() => {
    const users = getStoredUsers();
    if (users.length === 0) {
        const demoUsers: RawUser[] = [
            {
                id: 'user-demo-employee',
                email: 'employee@demo.com',
                role: UserRole.Employee,
                password_hash: 'hash_password123',
            },
            {
                id: 'user-demo-employer',
                email: 'employer@demo.com',
                role: UserRole.Employer,
                password_hash: 'hash_password123',
            },
        ];
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(demoUsers));
    }
  }, []);

  const storeAndSetUser = (userToStore: User) => {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(userToStore));
    setUser(userToStore);
  };

  const login = async (email: string, password_raw: string): Promise<void> => {
    setLoading(true);
    // Simulate network delay
    await new Promise(res => setTimeout(res, 500));

    const users = getStoredUsers();
    const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    // Simple password check (in reality, this would be a secure hash comparison)
    if (foundUser && foundUser.password_hash === `hash_${password_raw}`) {
      const sessionUser: User = { id: foundUser.id, email: foundUser.email, role: foundUser.role };
      storeAndSetUser(sessionUser);
      setLoading(false);
    } else {
      setLoading(false);
      throw new Error("Invalid email or password.");
    }
  };

  const signup = async (email: string, password_raw: string, role: UserRole): Promise<void> => {
    setLoading(true);
    await new Promise(res => setTimeout(res, 500));
    
    const users = getStoredUsers();
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        setLoading(false);
        throw new Error("An account with this email already exists.");
    }

    const newUser: RawUser = {
        id: `user-${Date.now()}`,
        email,
        role,
        password_hash: `hash_${password_raw}`, // Simulate hashing
    };

    users.push(newUser);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    
    const sessionUser: User = { id: newUser.id, email: newUser.email, role: newUser.role };
    storeAndSetUser(sessionUser);
    setLoading(false);
  };

  const loginWithGoogle = async (): Promise<void> => {
    setLoading(true);
    // This is a mock of the Google Sign-In flow.
    // In a real app, you'd use the Google Identity Services SDK.
    const email = prompt("To simulate Google Sign-In, please enter your email address:", "user@google.com");

    if (!email) {
      setLoading(false);
      return; // User cancelled the prompt
    }

    await new Promise(res => setTimeout(res, 500));
    const users = getStoredUsers();
    let foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (foundUser) {
      // User exists, log them in
      const sessionUser: User = { id: foundUser.id, email: foundUser.email, role: foundUser.role };
      storeAndSetUser(sessionUser);
    } else {
      // User does not exist, create a new account with a default role
      const newUser: RawUser = {
        id: `user-${Date.now()}`,
        email,
        role: UserRole.Employee, // Default role for new Google sign-ups
        password_hash: `hash_google_sso_${Date.now()}`, // Mock hash for SSO user
      };
      users.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

      const sessionUser: User = { id: newUser.id, email: newUser.email, role: newUser.role };
      storeAndSetUser(sessionUser);
    }
    setLoading(false);
  }

  const logout = () => {
    setUser(null);
    localStorage.removeItem(SESSION_STORAGE_KEY);
  };

  const value = { user, login, signup, loginWithGoogle, logout, loading: loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
