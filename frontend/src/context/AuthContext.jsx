import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();
const BACKEND = process.env.REACT_APP_BACKEND_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('kyro_token');
    if (token) fetchUser(token);
    else setLoading(false);
  }, []);

  const fetchUser = async (token) => {
    try {
      const res = await axios.get(`${BACKEND}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
    } catch {
      localStorage.removeItem('kyro_token');
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    window.location.href = `${BACKEND}/api/auth/google`;
  };

  const logout = () => {
    localStorage.removeItem('kyro_token');
    setUser(null);
  };

  const saveToken = (token) => {
    localStorage.setItem('kyro_token', token);
    fetchUser(token);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, saveToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);