import React, { createContext, useContext, useEffect } from 'react';
import useAuthStore from '../store/authStore';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const { user, token, isAuthenticated, ghostMode, login, logout, toggleGhostMode } = useAuthStore();
  const syncSession = useAuthStore((s) => s.syncSession);

  useEffect(() => {
    useAuthStore.getState().syncSession();
  }, []);

  const value = {
    user,
    token,
    isAuthenticated,
    ghostMode,
    login,
    logout,
    toggleGhostMode,
    syncSession,
  };

  return (
    <AuthContext.Provider value={value}>
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