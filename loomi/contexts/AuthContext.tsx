import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../services/api';

interface Usuario {
  nome: string;
  isAuthenticated: boolean;
}

interface AuthContextData {
  usuario: Usuario | null;
  login: (nome: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: () => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  const loadStoredUser = async () => {
    try {
      const usuarioSalvo = await AsyncStorage.getItem('usuario');
      if (usuarioSalvo) {
        setUsuario(JSON.parse(usuarioSalvo));
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (nome: string, senha: string) => {
    try {
      console.log('🔐 Tentando fazer login...', { nome });
      const response = await authService.login({ nome, senha });
      console.log('✅ Login bem-sucedido');
      
      const usuarioData: Usuario = {
        nome: nome,
        isAuthenticated: true
      };
      
      await AsyncStorage.setItem('usuario', JSON.stringify(usuarioData));
      setUsuario(usuarioData);
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Erro ao fazer login:', error);
      if (error.code === 'ERR_NETWORK') {
        throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
      }
      if (error.response?.status === 401) {
        throw new Error('Usuário ou senha inválidos');
      }
      throw new Error('Erro ao conectar com o servidor. Tente novamente.');
    }
  };

  const logout = async () => {
    await authService.logout();
    setUsuario(null);
  };

  const isAuthenticated = () => {
    return !!usuario;
  };

  const value: AuthContextData = {
    usuario,
    login,
    logout,
    isAuthenticated,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export default AuthContext;
