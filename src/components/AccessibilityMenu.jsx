import { useTheme } from '../contexts/ThemeContext';
import { Moon, Sun, Eye, EyeOff } from 'lucide-react';

export default function AccessibilityMenu() {
  const { isDark, setIsDark, isDaltonico, setIsDaltonico } = useTheme();

  return (
    <div className="flex items-center gap-1 ">
      
      {/* Botão Daltônico */}
      <button
        onClick={() => setIsDaltonico(!isDaltonico)}
        className={`
          p-2 rounded-full transition-all duration-200
          ${isDaltonico 
            ? 'text-purple-600 bg-purple-100 dark:bg-purple-900/30' // Ativo
            : 'text-muted-foreground hover:bg-gray-100 dark:hover:bg-zinc-800' // Inativo (Ghost)
          }
        `}
        title="Modo Daltônico"
      >
        {isDaltonico ? <Eye size={20} /> : <EyeOff size={20} />}
      </button>

      {/* Botão Tema Escuro */}
      <button
        onClick={() => setIsDark(!isDark)}
        className={`
          p-2 rounded-full transition-all duration-200
          ${isDark 
            ? 'text-yellow-400 hover:bg-zinc-800' // Sol
            : 'text-slate-600 hover:bg-gray-100'   // Lua
          }
        `}
        title="Alternar Tema"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

    </div>
  );
}