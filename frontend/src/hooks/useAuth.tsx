import React, { createContext, useContext, useEffect, useState } from 'react';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: 'parent' | 'kid' | 'elder';
  balance: number;
  savingsBalance: number;
  photoURL?: string;
  parentId?: string;
}

interface AuthContextType {
  user: any | null;
  profile: UserProfile | null;
  loading: boolean;
  login: (role?: 'parent' | 'kid' | 'elder' | 'elder_dad') => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock Users
const MOCK_PARENT: UserProfile = {
  uid: 'parent-123',
  email: 'parent@example.com',
  displayName: 'Adam',
  role: 'parent',
  balance: 5420,
  savingsBalance: 12000,
  photoURL: '/images/Adam.png'
};

const MOCK_KID: UserProfile = {
  uid: 'kid-456',
  email: 'kid@example.com',
  displayName: 'Isac',
  role: 'kid',
  balance: 120,
  savingsBalance: 450,
  parentId: 'parent-123',
  photoURL: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop',
};

const MOCK_ELDER: UserProfile = {
  uid: 'elder-789',
  email: 'mom@example.com',
  displayName: 'Mom',
  role: 'elder',
  balance: 2800,
  savingsBalance: 5000,
  parentId: 'parent-123',
  photoURL: 'https://images.unsplash.com/photo-1566616213894-2d4e1baee5d8?w=120&h=120&fit=crop',
};

const MOCK_ELDER_DAD: UserProfile = {
  uid: 'elder-790',
  email: 'dad@example.com',
  displayName: 'Dad',
  role: 'elder',
  balance: 3200,
  savingsBalance: 8500,
  parentId: 'parent-123',
  photoURL: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&h=120&fit=crop',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedProfile = localStorage.getItem('famwallet_profile');
    if (savedProfile) {
      const p = JSON.parse(savedProfile);
      // Always use fresh mock data to pick up any code changes
      let freshProfile: UserProfile;
      if (p.role === 'elder' && p.displayName === 'Dad') {
        freshProfile = MOCK_ELDER_DAD;
      } else if (p.role === 'elder') {
        freshProfile = MOCK_ELDER;
      } else if (p.role === 'kid') {
        freshProfile = MOCK_KID;
      } else {
        freshProfile = MOCK_PARENT;
      }
      setProfile(freshProfile);
      setUser({ uid: freshProfile.uid });
      localStorage.setItem('famwallet_profile', JSON.stringify(freshProfile));
    }
    setLoading(false);
  }, []);

  const login = async (role: 'parent' | 'kid' | 'elder' | 'elder_dad' = 'parent') => {
    let p: UserProfile;
    if (role === 'elder_dad') {
      p = MOCK_ELDER_DAD;
    } else if (role === 'elder') {
      p = MOCK_ELDER;
    } else if (role === 'kid') {
      p = MOCK_KID;
    } else {
      p = MOCK_PARENT;
    }
    setProfile(p);
    setUser({ uid: p.uid });
    localStorage.setItem('famwallet_profile', JSON.stringify(p));
  };

  const logout = async () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem('famwallet_profile');
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
