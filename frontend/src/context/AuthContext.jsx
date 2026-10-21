import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('campuscare_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('campuscare_token') || null);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message, type = 'info') => {
    setToastMessage({ id: Date.now(), message, type });
  };

  const closeToast = () => {
    setToastMessage(null);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = localStorage.getItem('campuscare_token');
      if (storedToken) {
        try {
          const res = await api.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('campuscare_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Session expired or invalid:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    if (data.success && data.token) {
      localStorage.setItem('campuscare_token', data.token);
      localStorage.setItem('campuscare_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      showToast(`Welcome back, ${data.user.name}!`, 'success');
      return data;
    }
  };

  const register = async (userData) => {
    const data = await api.register(userData);
    if (data.success && data.token) {
      localStorage.setItem('campuscare_token', data.token);
      localStorage.setItem('campuscare_user', JSON.stringify(data.user));
      setToken(data.token);
      setUser(data.user);
      showToast(`Registration successful! Welcome to CampusCare.`, 'success');
      return data;
    }
  };

  const logout = () => {
    localStorage.removeItem('campuscare_token');
    localStorage.removeItem('campuscare_user');
    setToken(null);
    setUser(null);
    showToast('You have been logged out.', 'info');
  };

  const loginWithDemo = async (role = 'student') => {
    try {
      if (role === 'admin') {
        return await login('admin@campuscare.edu', 'admin123');
      } else {
        return await login('student@campuscare.edu', 'student123');
      }
    } catch (err) {
      showToast(err.message || 'Demo login failed', 'error');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        loginWithDemo,
        toastMessage,
        showToast,
        closeToast,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
