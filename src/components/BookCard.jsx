import React, { useState } from 'react'
import { Trash2, BookMarked } from 'lucide-react'
import EditBookModal from './EditBookModal'
import '../App.css'

function BookCard({ livro, onDelete, onEdit }) {
  // Mapear o status/secoes para badge
  const getStatusBadge = (secoes) => {
    if (!secoes) return 'badge-desejo'
    const statusMap = {
      'LENDO': 'badge-lendo',
      'LIDO': 'badge-lido',
      'QUERO_LER': 'badge-desejo'
    }
    return statusMap[secoes] || 'badge-desejo'
  }

  // Mapear o status para label
  const getStatusLabel = (secoes) => {
    if (!secoes) return 'Quero Ler'
    const labelMap = {
      'LENDO': 'Lendo',
      'LIDO': 'Lido',
      'QUERO_LER': 'Quero Ler'
    }
    return labelMap[secoes] || 'Quero Ler'
  }

  // Gerar cor de fundo baseada no ISBN para diversidade visual
  const getGradient = (isbn) => {
    const colors = [
      'from-blue-400 to-blue-600',
      'from-purple-400 to-purple-600',
      'from-pink-400 to-pink-600',
      'from-green-400 to-green-600',
      'from-yellow-400 to-yellow-600',
      'from-indigo-400 to-indigo-600',
      'from-red-400 to-red-600',
      'from-teal-400 to-teal-600',
    ]
    const index = (isbn?.charCodeAt(0) || 0) % colors.length
    return colors[index]
  }

  // Calcular progresso
  const progressPercent = livro.andamento || 0

  return (
    <div className="book-card group">
      <div className="relative">
        {/* Capa do Livro */}
        <div
          className={`book-cover bg-gradient-to-br ${getGradient(livro.isbn)} flex items-end justify-center p-4 relative overflow-hidden shadow-lg`}
        >
          {/* Efeito de brilho */}
          <div className="absolute inset-0 bg-white opacity-10 transform -skew-y-12 group-hover:skew-y-12 transition duration-500"></div>
          
          {/* Ícone de livro */}
          <div className="relative z-10 text-white text-center">
            <BookMarked className="w-12 h-12 mx-auto mb-2 opacity-80" />
            <p className="text-xs font-bold text-white text-center line-clamp-3">
              {livro.nome || 'Sem título'}
            </p>
          </div>
        </div>

        {/* Badge de Status */}
        <div className={`absolute top-2 right-2 badge-status ${getStatusBadge(livro.secoes)}`}>
          {getStatusLabel(livro.secoes)}
        </div>
      </div>

      {/* Informações */}
      <div className="p-3 bg-white dark:bg-slate-800 rounded-lg rounded-t-none transition">
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-2 truncate">ISBN: {livro.isbn}</p>
        
        {/* Barra de Progresso */}
        {progressPercent > 0 && (
          <div className="mb-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-slate-600 dark:text-slate-300 font-semibold">Progresso</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{progressPercent}%</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-pink-500 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Botões de Ação */}
        <div className="flex gap-2 pt-2 border-t border-slate-100 dark:border-slate-700">
          <select
            value={livro.secoes || 'QUERO_LER'}
            onChange={(e) => onEdit({ ...livro, secoes: e.target.value })}
            className="flex-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 px-2 py-1.5 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition text-xs font-medium cursor-pointer border border-indigo-200 dark:border-indigo-800"
            title="Selecione o progresso da leitura"
          >
            <option value="QUERO_LER">Quero Ler</option>
            <option value="LENDO">Lendo</option>
            <option value="LIDO">Já Lido</option>
          </select>
          <button
            onClick={() => onDelete(livro.id)}
            className="flex-1 flex items-center justify-center gap-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-1.5 rounded hover:bg-red-100 dark:hover:bg-red-900/50 transition text-xs font-medium"
            title="Deletar livro"
          >
            <Trash2 className="w-3 h-3" />
            <span className="hidden sm:inline">Deletar</span>
          </button>
        </div>                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       
      </div>

      {/* Modal de Edição */}
    </div>
  )
}

export default BookCard
