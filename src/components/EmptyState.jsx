import React from 'react'
import { BookOpen, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-gradient-to-br from-indigo-100 to-pink-100 dark:from-indigo-900/30 dark:to-pink-900/30 p-8 rounded-full mb-6">
        <BookOpen className="w-16 h-16 text-indigo-600 dark:text-indigo-400" />
      </div>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Sua estante está vazia</h3>
      <p className="text-slate-600 dark:text-slate-400 text-center mb-6 max-w-md">
        Comece adicionando seus livros favoritos à sua estante virtual. Organize, acompanhe sua leitura e compartilhe sua paixão por livros!
      </p>
      <Link
        to="/adicionar"
        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-pink-700 transition transform hover:scale-105 font-semibold"
      >
        <Plus className="w-5 h-5" />
        Adicionar Primeiro Livro
      </Link>
    </div>
  )
}

export default EmptyState
