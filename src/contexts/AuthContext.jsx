import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/api'

const AuthContext = createContext({})

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Verificar se existe um usuário logado no localStorage
    const usuarioSalvo = authService.getCurrentUser()
    if (usuarioSalvo) {
      setUsuario(usuarioSalvo)
    }
    setLoading(false)
  }, [])

  const login = async (nome, senha) => {
    try {
      const response = await authService.login({ nome, senha })
      
      // Como o backend retorna apenas uma mensagem de sucesso,
      // vamos criar o objeto do usuário e salvar no localStorage
      const usuarioData = {
        nome: nome,
        isAuthenticated: true
      }
      
      localStorage.setItem('usuario', JSON.stringify(usuarioData))
      setUsuario(usuarioData)
      
      return response.data
    } catch (error) {
      console.error('Erro ao fazer login:', error)
      if (error.response?.status === 401) {
        throw new Error('Usuário ou senha inválidos')
      }
      throw new Error('Erro ao conectar com o servidor. Tente novamente.')
    }
  }

  const logout = () => {
    authService.logout()
    setUsuario(null)
  }

  const isAuthenticated = () => {
    return !!usuario
  }

  const value = {
    usuario,
    login,
    logout,
    isAuthenticated,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider')
  }
  return context
}

export default AuthContext
