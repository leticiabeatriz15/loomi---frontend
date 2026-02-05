import React, { useState, useEffect } from 'react'
import { Filter, Search } from 'lucide-react'
import BookCard from '../components/BookCard'
import LoadingSpinner from '../components/LoadingSpinner'
import EmptyState from '../components/EmptyState'
import Toast from '../components/Toast'
import { livroService } from '../services/api'
import '../App.css'

function BookshelfPage() {
  const [livros, setLivros] = useState([])
  const [filtrados, setFiltrados] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('todos')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    carregarLivros()
  }, [])

  useEffect(() => {
    aplicarFiltros()
  }, [livros, searchTerm, statusFilter])

  const carregarLivros = async () => {
    try {
      setLoading(true)
      const response = await livroService.listarLivros()
      console.log('Livros carregados:', response.data)
      setLivros(response.data || [])
    } catch (error) {
      console.error('Erro ao carregar livros:', error)
      setToast({ type: 'error', message: 'Erro ao carregar livros' })
    } finally {
      setLoading(false)
    }
  }

  const aplicarFiltros = () => {
    let resultado = [...livros]

    // Filtrar por status
    if (statusFilter !== 'todos') {
      resultado = resultado.filter(livro => livro.secoes === statusFilter)
    }

    // Filtrar por busca
    if (searchTerm) {
      resultado = resultado.filter(livro =>
        livro.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        livro.isbn?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFiltrados(resultado)
  }

  const handleDelete = async (id) => {
    console.log('ID recebido para deletar:', id)
    if (!id) {
      setToast({ type: 'error', message: 'ID do livro inválido' })
      return
    }
    if (window.confirm('Tem certeza que deseja deletar este livro?')) {
      try {
        await livroService.deletarLivro(id)
        setLivros(livros.filter(livro => livro.id !== id))
        setToast({ type: 'success', message: 'Livro removido com sucesso!' })
      } catch (error) {
        console.error('Erro ao deletar livro:', error)
        setToast({ type: 'error', message: 'Erro ao deletar livro' })
      }
    }
  }

  const handleEdit = (livro) => {
    // Atualizar a lista de livros com o livro editado
    setLivros(livros.map(l => l.id === livro.id ? livro : l))
    setToast({ type: 'success', message: 'Progresso atualizado com sucesso!' })
  }

  const stats = {
    total: livros.length,
    lendo: livros.filter(l => l.secoes === 'LENDO').length,
    lido: livros.filter(l => l.secoes === 'LIDO').length,
    queroLer: livros.filter(l => l.secoes === 'QUERO_LER').length
  }

  return (
    <div className="animate-fadeIn">
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition">
          <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-800 bg-clip-text text-transparent">
            {stats.total}
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Livros na estante</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {stats.lendo}
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Estou lendo</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">
            {stats.lido}
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Já lidos</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition">
          <div className="text-3xl font-bold text-pink-600 dark:text-pink-400">
            {stats.queroLer}
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Quero ler</p>
        </div>
      </div>

      {/* Barra de Filtro e Busca */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 mb-8 transition">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Buscar por título ou ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          {/* Filtro */}
          <div className="relative flex items-center gap-2">
            <Filter className="w-5 h-5 text-slate-400 dark:text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 px-4 py-2 border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            >
              <option value="todos">Todos os livros</option>
              <option value="LENDO">Estou lendo</option>
              <option value="LIDO">Já li</option>
              <option value="QUERO_LER">Quero ler</option>
            </select>
          </div>
        </div>
      </div>

      {/* Biblioteca */}
      {loading ? (
        <LoadingSpinner />
      ) : filtrados.length === 0 && livros.length === 0 ? (
        <EmptyState />
      ) : filtrados.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500 dark:text-slate-400 text-lg">Nenhum livro encontrado com os filtros selecionados</p>
        </div>
      ) : (
        <div className="book-grid">
          {filtrados.map(livro => (
            <BookCard
              key={livro.id}
              livro={livro}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {/* Toast de Notificação */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  )
}

export default BookshelfPage
