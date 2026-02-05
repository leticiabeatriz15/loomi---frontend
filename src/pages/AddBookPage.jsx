import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, BookPlus } from 'lucide-react'
import Toast from '../components/Toast'
import { livroService } from '../services/api'

function AddBookPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const [formData, setFormData] = useState({
    id: null,
    isbn: '',
    nome: '',
    secoes: 'QUERO_LER',
    andamento: 0
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'andamento' ? parseInt(value) : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validações
    if (!formData.isbn.trim()) {
      setToast({ type: 'error', message: 'ISBN é obrigatório' })
      return
    }
    if (!formData.nome.trim()) {
      setToast({ type: 'error', message: 'Título do livro é obrigatório' })
      return
    }

    try {
      setLoading(true)
      await livroService.criarLivro(formData)
      setToast({ type: 'success', message: 'Livro adicionado com sucesso!' })
      setTimeout(() => navigate('/'), 2000)
    } catch (error) {
      console.error('Erro ao adicionar livro:', error)
      setToast({ type: 'error', message: 'Erro ao adicionar livro' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto animate-fadeIn">
      {/* Botão de voltar */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 mb-6 font-medium transition"
      >
        <ArrowLeft className="w-5 h-5" />
        Voltar para estante
      </button>

      {/* Formulário */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-8 transition">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-indigo-600 to-pink-600 p-3 rounded-lg">
            <BookPlus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Adicionar Livro</h1>
            <p className="text-slate-600 dark:text-slate-400">Compartilhe um novo livro com sua estante virtual</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ISBN */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              ISBN *
            </label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              placeholder="Ex: 978-8532519825"
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              required
            />
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">ISBN do livro (identificador único)</p>
          </div>

          {/* Título */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Título do Livro *
            </label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              placeholder="Ex: O Senhor dos Anéis"
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Status de Leitura
            </label>
            <select
              name="secoes"
              value={formData.secoes}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            >
              <option value="QUERO_LER">Quero Ler</option>
              <option value="LENDO">Estou Lendo</option>
              <option value="LIDO">Já Li</option>
            </select>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Qual é o status do livro na sua leitura?</p>
          </div>

          {/* Progresso */}
          {formData.secoes === 'LENDO' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Progresso de Leitura: {formData.andamento}%
              </label>
              <input
                type="range"
                name="andamento"
                min="0"
                max="100"
                value={formData.andamento}
                onChange={handleChange}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mt-2">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>
          )}

          {/* Preview */}
          <div className="bg-slate-50 dark:bg-slate-900/50 p-6 rounded-lg border border-slate-200 dark:border-slate-700">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Prévia do Livro</h3>
            <div className="flex gap-4">
              {/* Capa simulada */}
              <div className="w-24 h-36 bg-gradient-to-br from-indigo-600 to-pink-600 rounded-lg flex items-end justify-center p-2 text-white text-center">
                <div className="text-xs font-bold line-clamp-2">
                  {formData.nome || 'Título'}
                </div>
              </div>
              {/* Info */}
              <div className="flex-1">
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  <span className="font-semibold">Título:</span> {formData.nome || '(não preenchido)'}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                  <span className="font-semibold">ISBN:</span> {formData.isbn || '(não preenchido)'}
                </p>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                  <span className="font-semibold">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                    formData.secoes === 'LENDO' ? 'bg-blue-100 text-blue-700' :
                    formData.secoes === 'LIDO' ? 'bg-green-100 text-green-700' :
                    'bg-pink-100 text-pink-700'
                  }`}>
                    {formData.secoes === 'LENDO' ? 'Lendo' :
                     formData.secoes === 'LIDO' ? 'Lido' :
                     'Quero Ler'}
                  </span>
                </p>
                {formData.secoes === 'LENDO' && (
                  <>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-2">
                      <span className="font-semibold">Progresso:</span> {formData.andamento}%
                    </p>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2 mt-2">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-pink-500 h-full rounded-full"
                        style={{ width: `${formData.andamento}%` }}
                      ></div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="flex-1 px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition font-semibold"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-pink-600 text-white rounded-lg hover:from-indigo-700 hover:to-pink-700 transition font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Adicionando...
                </>
              ) : (
                <>
                  <BookPlus className="w-5 h-5" />
                  Adicionar Livro
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Toast */}
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

export default AddBookPage
