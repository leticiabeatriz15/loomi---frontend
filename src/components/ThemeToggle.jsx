import React, { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'

function ThemeToggle() {
  // Função para obter o tema inicial
  const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      return savedTheme === 'dark'
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  const [darkMode, setDarkMode] = useState(getInitialTheme)

  // Aplicar o tema quando o estado mudar
  useEffect(() => {
    const root = document.documentElement
    
    if (darkMode) {
      root.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      root.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
    
    console.log('🎨 Tema aplicado:', darkMode ? 'escuro' : 'claro')
  }, [darkMode])

  const toggleTheme = () => {
    console.log('🔄 Alternando tema...')
    setDarkMode(prev => !prev)
  }

  return (
    <button
      onClick={toggleTheme}
      className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition group"
      title={darkMode ? 'Mudar para Modo Claro' : 'Mudar para Modo Escuro'}
      aria-label={darkMode ? 'Ativar modo claro' : 'Ativar modo escuro'}
    >
      {darkMode ? (
        <Sun className="w-5 h-5 text-yellow-500 group-hover:rotate-180 transition-transform duration-300" />
      ) : (
        <Moon className="w-5 h-5 text-slate-500 group-hover:rotate-12 transition-transform duration-300" />
      )}
    </button>
  )
}

export default ThemeToggle
