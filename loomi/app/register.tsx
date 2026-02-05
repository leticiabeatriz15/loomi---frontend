import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { BookOpen, UserPlus, User, Lock, CheckCircle } from 'lucide-react-native';
import { usuarioService } from '../services/api';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: '',
    senha: '',
    confirmarSenha: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.nome.trim()) {
      Alert.alert('Erro', 'Nome de usuário é obrigatório');
      return false;
    }

    if (formData.nome.length < 3) {
      Alert.alert('Erro', 'Nome de usuário deve ter pelo menos 3 caracteres');
      return false;
    }

    if (!formData.senha) {
      Alert.alert('Erro', 'Senha é obrigatória');
      return false;
    }

    if (formData.senha.length < 6) {
      Alert.alert('Erro', 'Senha deve ter pelo menos 6 caracteres');
      return false;
    }

    if (formData.senha !== formData.confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await usuarioService.criarUsuario({
        nome: formData.nome,
        senha: formData.senha
      });

      setSuccess(true);
      
      setTimeout(() => {
        router.replace('/login');
      }, 2000);
    } catch (err: any) {
      console.error('Erro ao cadastrar:', err);
      if (err.code === 'ERR_NETWORK') {
        Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
      } else if (err.response?.status === 400) {
        Alert.alert('Erro', 'Dados inválidos. Verifique as informações.');
      } else if (err.response?.status === 409) {
        Alert.alert('Erro', 'Nome de usuário já está em uso.');
      } else {
        Alert.alert('Erro', 'Erro ao cadastrar. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successCard}>
            <View style={styles.successIconBox}>
              <CheckCircle color="#22c55e" size={48} />
            </View>
            <Text style={styles.successTitle}>Cadastro realizado com sucesso!</Text>
            <Text style={styles.successText}>Redirecionando para o login...</Text>
            <ActivityIndicator size="large" color="#4f46e5" style={styles.spinner} />
          </View>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <BookOpen color="#fff" size={48} />
          </View>
          <Text style={styles.title}>Loomi</Text>
          <Text style={styles.subtitle}>Crie sua conta e organize sua estante</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Criar nova conta</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome de Usuário</Text>
            <View style={styles.inputWrapper}>
              <User color="#94a3b8" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mínimo 3 caracteres"
                placeholderTextColor="#94a3b8"
                value={formData.nome}
                onChangeText={(value) => handleChange('nome', value)}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.inputWrapper}>
              <Lock color="#94a3b8" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#94a3b8"
                value={formData.senha}
                onChangeText={(value) => handleChange('senha', value)}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Confirmar Senha</Text>
            <View style={styles.inputWrapper}>
              <Lock color="#94a3b8" size={20} style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Digite a senha novamente"
                placeholderTextColor="#94a3b8"
                value={formData.confirmarSenha}
                onChangeText={(value) => handleChange('confirmarSenha', value)}
                secureTextEntry
                autoCapitalize="none"
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <View style={styles.buttonContent}>
                <ActivityIndicator color="#fff" />
                <Text style={styles.buttonText}>Criando conta...</Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                <UserPlus color="#fff" size={20} />
                <Text style={styles.buttonText}>Criar Conta</Text>
              </View>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.push('/login')}>
              <Text style={styles.footerLink}>Fazer login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  scrollView: { flexGrow: 1, justifyContent: 'center', padding: 16 },
  logoContainer: { alignItems: 'center', marginBottom: 32 },
  logoBox: { backgroundColor: '#4f46e5', padding: 16, borderRadius: 16, marginBottom: 16 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#4f46e5', marginBottom: 8 },
  subtitle: { fontSize: 14, color: '#94a3b8' },
  card: { backgroundColor: '#1e293b', borderRadius: 16, padding: 24, borderWidth: 1, borderColor: '#334155' },
  cardTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 24 },
  inputContainer: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', color: '#cbd5e1', marginBottom: 8 },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#475569', borderRadius: 8, backgroundColor: '#334155' },
  inputIcon: { marginLeft: 12 },
  input: { flex: 1, paddingVertical: 12, paddingHorizontal: 12, color: '#fff', fontSize: 16 },
  button: { backgroundColor: '#4f46e5', paddingVertical: 12, borderRadius: 8, marginTop: 8 },
  buttonDisabled: { opacity: 0.5 },
  buttonContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: '#94a3b8', fontSize: 14 },
  footerLink: { color: '#4f46e5', fontSize: 14, fontWeight: '600' },
  successContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  successCard: { backgroundColor: '#1e293b', borderRadius: 16, padding: 32, borderWidth: 1, borderColor: '#334155', alignItems: 'center', width: '100%' },
  successIconBox: { backgroundColor: '#22c55e20', padding: 16, borderRadius: 50, marginBottom: 16 },
  successTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff', textAlign: 'center', marginBottom: 8 },
  successText: { fontSize: 14, color: '#94a3b8', textAlign: 'center', marginBottom: 16 },
  spinner: { marginTop: 8 },
});
