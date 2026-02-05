import React from 'react'

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-indigo-600 animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent border-r-pink-600 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '2s' }}></div>
      </div>
      <span className="ml-4 text-slate-600 dark:text-slate-400 font-medium">Carregando...</span>
    </div>
  )
}

export default LoadingSpinner
