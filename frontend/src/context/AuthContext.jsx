import { createContext, useContext, useState } from 'react';
import { authApi } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('skillswap_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email, password) => {
    const { data } = await authApi.login({ email, password });
    persist(data);
  };

  const register = async (email, password, fullName) => {
    const { data } = await authApi.register({ email, password, fullName });
    persist(data);
  };

  const persist = (data) => {
    localStorage.setItem('skillswap_token', data.token);
    const userData = { id: data.userId, fullName: data.fullName, email: data.email };
    localStorage.setItem('skillswap_user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('skillswap_token');
    localStorage.removeItem('skillswap_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
