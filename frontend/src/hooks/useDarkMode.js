// useDarkMode.js
import { useEffect, useState, useMemo } from 'react';

export const useDarkMode = () => {
  const [theme, setTheme] = useState('light');
  const [componentMounted, setComponentMounted] = useState(false);

  const setMode = mode => {
    window.localStorage.setItem('theme', mode)
    setTheme(mode)
  };

  const toggleTheme = () => {
    console.log("toggleTheme : ")
    if (theme === 'light') {
      setMode('dark')
      console.log("setMode dark")
    } else {
      setMode('light')
      console.log("setMode light")
    }
  };

  useEffect(() => {
    const localTheme = window.localStorage.getItem('theme');
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches && !localTheme ?
      setMode('dark') :
      localTheme ?
        setTheme(localTheme) :
        setMode('light');
    setComponentMounted(true);
  }, []);

  return [theme==="dark"?true:false, toggleTheme, componentMounted]
};