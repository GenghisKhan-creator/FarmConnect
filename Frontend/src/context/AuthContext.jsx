import { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

// Demo users for mockup
const DEMO_USERS = [
  {
    id: 1,
    name: 'Issah Abubakari',
    email: 'issah@farmconnect.gh',
    phone: '0244123456',
    role: 'farmer',
    farmName: 'Issah Farms',
    location: 'Tumu',
    district: 'Sissala East',
    region: 'Upper West',
    farmSize: '10 acres',
    crops: ['Maize', 'Millet', 'Groundnuts'],
    rating: 4.8,
    totalReviews: 24,
    verified: true,
    avatar: null,
    plan: 'premium',
  },
  {
    id: 2,
    name: 'Amina Seidu',
    email: 'amina@buyer.gh',
    phone: '0243987654',
    role: 'buyer',
    businessName: 'Amina Traders',
    businessType: 'Trader',
    location: 'Wa',
    district: 'Wa Municipal',
    region: 'Upper West',
    avatar: null,
    plan: 'free',
  },
  {
    id: 3,
    name: 'Admin User',
    email: 'admin@farmconnect.gh',
    phone: '0200000001',
    role: 'admin',
    avatar: null,
    plan: 'admin',
  },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    setError(null);
    // Simulate async
    await new Promise(r => setTimeout(r, 800));
    const found = DEMO_USERS.find(u => u.email === email);
    if (found && password.length >= 4) {
      setUser(found);
      setLoading(false);
      return { success: true, user: found };
    }
    setError('Invalid email or password. Try issah@farmconnect.gh (farmer) or amina@buyer.gh (buyer) with any password.');
    setLoading(false);
    return { success: false };
  }, []);

  const register = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    await new Promise(r => setTimeout(r, 900));
    const newUser = {
      id: Date.now(),
      ...data,
      verified: false,
      rating: 0,
      totalReviews: 0,
      avatar: null,
      plan: 'free',
    };
    setUser(newUser);
    setLoading(false);
    return { success: true, user: newUser };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const updateProfile = useCallback((updates) => {
    setUser(prev => ({ ...prev, ...updates }));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
