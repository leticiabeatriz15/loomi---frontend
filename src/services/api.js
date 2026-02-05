import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Interceptor para tratamento de erros
api.interceptors.response.use(
  response => response,
  error => {
    console.error('Erro na requisição:', error)
    return Promise.reject(error)
  }
)

export const livroService = {
  // Listar todos os livros
  listarLivros: () => api.get('/livro'),
  
  // Buscar livro por ID
  buscarLivroPorId: (id) => api.get(`/livro/${id}`),
  
  // Criar novo livro
  criarLivro: (livroData) => api.post('/livro', livroData),
  
  // Atualizar livro
  atualizarLivro: (id, livroData) => api.put(`/livro/${id}`, livroData),
  
  // Deletar livro
  deletarLivro: (id) => {
    console.log('Deletando livro com ID:', id)
    if (!id) {
      console.error('ID é undefined ou null!')
      return Promise.reject(new Error('ID inválido'))
    }
    return api.delete(`/livro/${id}`)
  },
}

export const usuarioService = {
  // Listar todos os usuários
  listarUsuarios: () => api.get('/usuario'),
  
  // Buscar usuário por ID
  buscarUsuarioPorId: (id) => api.get(`/usuario/${id}`),
  
  // Criar novo usuário
  criarUsuario: (usuarioData) => api.post('/usuario', usuarioData),
  
  // Atualizar usuário
  atualizarUsuario: (id, usuarioData) => api.put(`/usuario/${id}`, usuarioData),
  
  // Deletar usuário
  deletarUsuario: (id) => api.delete(`/usuario/${id}`),
}

export const authService = {
  // Login
  login: (loginData) => api.post('/auth/login', loginData),
  
  // Logout
  logout: () => {
    localStorage.removeItem('usuario')
    localStorage.removeItem('token')
  },
  
  // Verificar se está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('usuario')
  },
  
  // Obter usuário atual
  getCurrentUser: () => {
    const usuario = localStorage.getItem('usuario')
    return usuario ? JSON.parse(usuario) : null
  },
}

export default api
