import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { BookOpen, Plus, LogOut } from 'lucide-react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import BookshelfPage from './pages/BookshelfPage'
import AddBookPage from './pages/AddBookPage'
import ThemeToggle from './components/ThemeToggle'
import './App.css'

function AppContent() {
  const { usuario, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 transition-colors duration-200">
      {/* Header - Mostrar apenas se estiver autenticado */}
      {isAuthenticated() && (
        <header className="sticky top-0 z-50 bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Link to="/" className="flex items-center gap-2 group">
                <div className="bg-gradient-to-br from-indigo-600 to-pink-600 p-2 rounded-lg transform group-hover:scale-105 transition">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                    Loomi
                  </span>
                  <span className="text-xs text-slate-500">Estante Virtual</span>
                </div>
              </Link>

              <nav className="flex items-center gap-6">
                <div className="text-sm text-slate-700 dark:text-slate-300">
                  Bem-vindo, <span className="font-semibold text-indigo-600 dark:text-indigo-400">{usuario?.nome}</span>
                </div>
                <Link
                  to="/adicionar"
                  className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white px-4 py-2 rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition transform hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar Livro
                </Link>
                <ThemeToggle />
                <button 
                  onClick={handleLogout}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition"
                  title="Sair"
                >
                  <LogOut className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </button>
              </nav>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={isAuthenticated() ? "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" : ""}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/cadastro" element={<RegisterPage />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <BookshelfPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/adicionar"
            element={
              <PrivateRoute>
                <AddBookPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </main>

      {/* Footer - Mostrar apenas se estiver autenticado */}
      {isAuthenticated() && (
        <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-16 transition-colors duration-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center text-slate-500 dark:text-slate-400 text-sm">
              <p>© 2026 Loomi - Sua Estante Virtual de Livros</p>
              <p className="mt-2">Feito por: Christian David, Emanuelle de Carvalho e Letícia Beatriz</p>
            </div>
          </div>
        </footer>
      )}
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App
