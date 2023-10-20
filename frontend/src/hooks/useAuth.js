import { React, createContext, useContext, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { setUserSession, removeUserSession, getUser } from 'utils/AuthService';
import { useLocalStorage } from './useLocalStorage';

const AuthContext = createContext();

const defaultTheme = "#e495e6"
// colorPrimary: 'blossom',

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getUser());
  const [darkMode, setDarkMode] = useLocalStorage('theme', false);
  const [themeColor, setThemeColor] = useLocalStorage('themeColor', defaultTheme);

  // const [darkMode, setDarkMode] = useState(
  //   localStorage.getItem('theme') === 'dark' ||
  //     (localStorage.getItem('theme') !== 'light' &&
  //       matchMedia('(prefers-color-scheme: dark)').matches)
  // );

  const navigate = useNavigate();

  const login = useCallback(async (data) => { // Wrap login in useCallback
    setUser(data.user);
    setUserSession(data.token, data.user, data.permission);
    navigate('/', { replace: true });
  }, [navigate]); // Add any other dependencies used inside login function here

  const logout = useCallback(async () => {
    setUser(null);
    removeUserSession();
    navigate('/login', { replace: true });
  }, [navigate]); 

  const toggleDark = useCallback(async () => {
    localStorage.setItem('theme', darkMode ? true : !darkMode);
    setDarkMode(!darkMode);
  }, [darkMode]); 

  const changeThemeColor = useCallback(async (themeColor) => {
    localStorage.setItem('theme', themeColor);
    setThemeColor(themeColor);
  }, [themeColor]); 

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      darkMode,
      toggleDark,
      themeColor,
      changeThemeColor,
    }),
    [user, login, logout, darkMode, toggleDark, themeColor, changeThemeColor], // Include login and logout in the dependency array
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
