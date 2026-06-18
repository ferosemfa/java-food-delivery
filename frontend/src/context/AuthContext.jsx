import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login as apiLogin, register as apiRegister, verifyOtp as apiVerifyOtp, refreshToken as apiRefreshToken } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshTokenValue, setRefreshTokenValue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed && typeof parsed === 'object') {
          if (parsed.role) parsed.role = parsed.role.toUpperCase();
          setToken(storedToken);
          setRefreshTokenValue(storedRefreshToken);
          setUser(parsed);
        } else {
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        }
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const persistAuth = useCallback((newToken, newRefreshToken, newUser) => {
    setToken(newToken);
    setRefreshTokenValue(newRefreshToken);
    setUser(newUser);
    localStorage.setItem('token', newToken);
    if (newRefreshToken) localStorage.setItem('refreshToken', newRefreshToken);
    localStorage.setItem('user', JSON.stringify(newUser));
  }, []);

  const login = useCallback(async (credentials) => {
    try {
      const response = await apiLogin(credentials);
      const d = response.data.data || response.data;
      const t = d.accessToken || d.token;
      const rt = d.refreshToken;
      const u = { id: d.userId, email: d.email, name: d.name, role: (d.role || '').toUpperCase() };
      persistAuth(t, rt, u);
      toast.success(`Welcome back, ${u.name || u.email}!`);
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
      throw error;
    }
  }, [persistAuth]);

  const register = useCallback(async (userData) => {
    try {
      const response = await apiRegister(userData);
      const d = response.data.data || response.data;
      const t = d.accessToken || d.token;
      const rt = d.refreshToken;
      const u = d.user || (d.id ? { id: d.userId, email: d.email, name: d.name, role: (d.role || '').toUpperCase() } : null);
      if (t && u) {
        persistAuth(t, rt, u);
      }
      toast.success('Registration successful!');
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
      throw error;
    }
  }, [persistAuth]);

  const verifyOtp = useCallback(async (otpData) => {
    try {
      const response = await apiVerifyOtp(otpData);
      const d = response.data.data || response.data;
      const t = d.accessToken || d.token;
      const rt = d.refreshToken;
      const u = d.user || (d.id ? { id: d.userId, email: d.email, name: d.name, role: (d.role || '').toUpperCase() } : null);
      if (t && u) {
        persistAuth(t, rt, u);
      }
      toast.success('OTP verified successfully!');
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || 'OTP verification failed.';
      toast.error(msg);
      throw error;
    }
  }, [persistAuth]);

  const refreshUserToken = useCallback(async () => {
    if (!refreshTokenValue) return null;
    try {
      const response = await apiRefreshToken({ refreshToken: refreshTokenValue });
      const d = response.data.data || response.data;
      const t = d.accessToken || d.token;
      const rt = d.refreshToken;
      setToken(t);
      setRefreshTokenValue(rt);
      localStorage.setItem('token', t);
      if (rt) localStorage.setItem('refreshToken', rt);
      return t;
    } catch {
      logout();
      return null;
    }
  }, [refreshTokenValue]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setRefreshTokenValue(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  }, []);

  const isAuthenticated = !!token && !!user;
  const role = user?.role || null;

  return (
    <AuthContext.Provider value={{
      user, token, refreshToken: refreshTokenValue,
      isAuthenticated, role, loading,
      login, register, verifyOtp, logout, refreshUserToken,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
