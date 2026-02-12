import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'https://loomi-backend-3whc.onrender.com'; 

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, 
});


api.interceptors.request.use(
  config => {
    console.log(`${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  error => {
    console.error('Erro na requisição:', error);
    return Promise.reject(error);
  }
);


api.interceptors.response.use(
  response => {
    console.log(`${response.config.method?.toUpperCase()} ${response.config.url} - Status: ${response.status}`);
    return response;
  },
  error => {
    if (error.code === 'ECONNABORTED') {
      console.error('Timeout: O servidor não respondeu a tempo');
    } else if (error.code === 'ERR_NETWORK') {
      console.error('Erro de rede: Verifique se o backend está rodando e se o IP está correto');
      console.error(`Tentando conectar em: ${API_BASE_URL}`);
    } else {
      console.error('Erro na requisição:', error.message);
    }
    return Promise.reject(error);
  }
);

export const livroService = {
  listarLivros: () => api.get('/livro'),
  buscarLivroPorId: (id: string) => api.get(`/livro/${id}`),
  criarLivro: (livroData: any) => api.post('/livro', livroData),
  atualizarLivro: (id: string, livroData: any) => api.put(`/livro/${id}`, livroData),
  deletarLivro: (id: string) => {
    console.log('Deletando livro com ID:', id);
    if (!id) {
      console.error('ID é undefined ou null!');
      return Promise.reject(new Error('ID inválido'));
    }
    return api.delete(`/livro/${id}`);
  },
};

export const usuarioService = {
  listarUsuarios: () => api.get('/usuario'),
  buscarUsuarioPorId: (id: string) => api.get(`/usuario/${id}`),
  criarUsuario: (usuarioData: any) => api.post('/usuario', usuarioData),
  atualizarUsuario: (id: string, usuarioData: any) => api.put(`/usuario/${id}`, usuarioData),
  deletarUsuario: (id: string) => api.delete(`/usuario/${id}`),
};

export const authService = {
  login: (loginData: any) => api.post('/auth/login', loginData),
  
  logout: async () => {
    await AsyncStorage.removeItem('usuario');
    await AsyncStorage.removeItem('token');
  },
  
  isAuthenticated: async () => {
    const usuario = await AsyncStorage.getItem('usuario');
    return !!usuario;
  },
  
  getCurrentUser: async () => {
    const usuario = await AsyncStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  },
};

export default api;
