import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const AuthContext = createContext(null);

import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const token = localStorage.getItem('farmconnect_token');
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await axios.get(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser({ ...data, token });
      } catch (err) {
        console.error(err);
        localStorage.removeItem('farmconnect_token');
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(`${API_URL}/auth/login`, { email, password });
      setUser(data);
      localStorage.setItem('farmconnect_token', data.token);
      setLoading(false);
      return { success: true, user: data };
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
      setLoading(false);
      return { success: false };
    }
  }, []);

  const register = useCallback(async (formData) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.post(`${API_URL}/auth/register`, formData);
      setUser(data);
      localStorage.setItem('farmconnect_token', data.token);
      setLoading(false);
      return { success: true, user: data };
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register account.');
      setLoading(false);
      return { success: false };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('farmconnect_token');
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
