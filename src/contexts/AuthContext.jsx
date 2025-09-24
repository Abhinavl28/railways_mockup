import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // On initial load, restore user from storage
    try {
      const rememberMe = localStorage.getItem('rememberMe') === 'true';
      const localUser = localStorage.getItem('user');
      const sessionUser = sessionStorage.getItem('user');

      if (rememberMe && localUser) {
        setUser(JSON.parse(localUser));
      } else if (sessionUser) {
        setUser(JSON.parse(sessionUser));
      }
    } catch (e) {
      // If parsing fails, clear bad data
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      localStorage.removeItem('rememberMe');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (userData, remember) => {
    // In a real app, you would make an API call here
    // For now, we'll simulate a successful login
    const userInfo = {
      id: userData.controllerId,
      name: `Controller ${userData.controllerId}`,
      role: 'section_controller',
      section: userData.sectionCode,
      region: userData.cityRegion,
      state: userData.state,
      lastLogin: new Date().toISOString()
    };

    setUser(userInfo);

    // Clear previous storages for safety
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');

    if (remember) {
      localStorage.setItem('user', JSON.stringify(userInfo));
      localStorage.setItem('rememberMe', 'true');
    } else {
      sessionStorage.setItem('user', JSON.stringify(userInfo));
      localStorage.setItem('rememberMe', 'false');
    }

    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('rememberMe');
    sessionStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
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

export default AuthContext;
