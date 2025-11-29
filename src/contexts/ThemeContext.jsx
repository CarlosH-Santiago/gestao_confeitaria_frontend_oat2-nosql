import { createContext, useState, useEffect, useContext } from 'react';

// O tipo de contexto foi removido porque interfaces são recursos do TypeScript.
// Para validação de tipo em arquivos .jsx, considere usar PropTypes.

const ThemeContext = createContext(undefined);

export const ThemeProvider = ({ children }) => {
  
  // --- 1. ESTADO DARK MODE ---
  const [isDark, setIsDark] = useState(() => {
    // Tenta ler do localStorage, se não tiver, assume false (Claro)
    if (typeof window !== "undefined") {
      return localStorage.getItem('theme') === 'dark';
    }
    return false;
  });

  // --- 2. ESTADO DALTONISMO ---
  const [isDaltonico, setIsDaltonico] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem('accessibility') === 'true';
    }
    return false;
  });

  // Efeito 1: Aplica/Remove a classe 'dark' no HTML
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  // Efeito 2: Aplica/Remove o atributo 'data-daltonico' no HTML
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDaltonico) {
      root.setAttribute('data-daltonico', 'true');
      localStorage.setItem('accessibility', 'true');
    } else {
      root.removeAttribute('data-daltonico');
      localStorage.setItem('accessibility', 'false');
    }
  }, [isDaltonico]);

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark, isDaltonico, setIsDaltonico }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para usar fácil
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};