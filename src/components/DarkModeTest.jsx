import React from 'react'

// Componente de teste para verificar se o dark mode está funcionando
function DarkModeTest() {
  return (
    <div className="fixed bottom-20 right-4 z-50 p-4 bg-white dark:bg-slate-800 border-2 border-slate-300 dark:border-slate-600 rounded-lg shadow-lg">
      <div className="space-y-2 text-sm">
        <p className="font-bold text-slate-900 dark:text-white">
          🧪 Teste Dark Mode
        </p>
        <p className="text-slate-600 dark:text-slate-300">
          Se você ver cores diferentes aqui, o dark mode está funcionando!
        </p>
        <div className="flex gap-2 mt-2">
          <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded"></div>
          <div className="w-8 h-8 bg-slate-400 dark:bg-slate-500 rounded"></div>
          <div className="w-8 h-8 bg-slate-600 dark:bg-slate-300 rounded"></div>
        </div>
      </div>
    </div>
  )
}

export default DarkModeTest
