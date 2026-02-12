import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BookOpen, RefreshCw, Save } from 'lucide-react-native';
import { livroService } from '../services/api';
import axios from 'axios';

export default function EditBookPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [autoLoading, setAutoLoading] = useState(false);
  const [formData, setFormData] = useState({
    isbn: '',
    nome: '',
    secoes: 'QUERO_LER',
    andamento: 0
  });

  useEffect(() => {
    if (id) {
      carregarLivro();
    }
  }, [id]);

  const carregarLivro = async () => {
    try {
      setLoadingData(true);
      console.log('Carregando livro com ID:', id);
      const response = await livroService.buscarLivroPorId(id as string);
      const livro = response.data;
      
      setFormData({
        isbn: livro.isbn || '',
        nome: livro.nome || '',
        secoes: livro.secoes || 'QUERO_LER',
        andamento: livro.andamento || 0
      });
    } catch (error: any) {
      console.error('Erro ao carregar livro:', error);
      Alert.alert('Erro', 'Não foi possível carregar os dados do livro', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } finally {
      setLoadingData(false);
    }
  };

  const handleChange = (name: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [name]: name === 'andamento' ? parseInt(value.toString()) : value
    }));
  };

  const buscarLivroPorISBN = async (isbn: string) => {
    const isbnLimpo = isbn.replace(/[^0-9X]/gi, '');
    
    if (isbnLimpo.length !== 10 && isbnLimpo.length !== 13) {
      return;
    }

    try {
      setAutoLoading(true);
      console.log('Buscando livro com ISBN:', isbnLimpo);
      
      const response = await axios.get(
        `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbnLimpo}`
      );

      if (response.data.items && response.data.items.length > 0) {
        const bookInfo = response.data.items[0].volumeInfo;
        
        if (bookInfo.title) {
          setFormData(prev => ({
            ...prev,
            nome: bookInfo.title
          }));
          Alert.alert('Sucesso', `Livro encontrado: ${bookInfo.title}`);
        }
      } else {
        Alert.alert('Aviso', 'Nenhum livro encontrado com este ISBN');
      }
    } catch (error) {
      console.error('Erro ao buscar livro:', error);
      Alert.alert('Erro', 'Não foi possível buscar informações do livro');
    } finally {
      setAutoLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.isbn.trim()) {
      Alert.alert('Erro', 'ISBN é obrigatório');
      return;
    }
    if (!formData.nome.trim()) {
      Alert.alert('Erro', 'Título do livro é obrigatório');
      return;
    }

    try {
      setLoading(true);
      console.log('Atualizando livro:', id, formData);
      await livroService.atualizarLivro(id as string, formData);
      console.log('Livro atualizado com sucesso!');
      Alert.alert('Sucesso', 'Livro atualizado com sucesso!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      console.error('Erro ao atualizar livro:', error);
      if (error.code === 'ERR_NETWORK') {
        Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor.');
      } else {
        Alert.alert('Erro', 'Erro ao atualizar livro');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.loadingText}>Carregando dados do livro...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.iconBox}>
              <BookOpen color="#fff" size={24} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>Editar Livro</Text>
              <Text style={styles.subtitle}>Atualize as informações do livro</Text>
            </View>
          </View>

          {/* ISBN */}
          <View style={styles.inputContainer}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>ISBN *</Text>
              {autoLoading && (
                <View style={styles.autoLoadingContainer}>
                  <ActivityIndicator size="small" color="#4f46e5" />
                  <Text style={styles.autoLoadingText}>Buscando...</Text>
                </View>
              )}
            </View>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.inputWithButton]}
                placeholder="Ex: 978-8532519825"
                placeholderTextColor="#94a3b8"
                value={formData.isbn}
                onChangeText={(value) => handleChange('isbn', value)}
              />
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={() => buscarLivroPorISBN(formData.isbn)}
                disabled={autoLoading}
              >
                <RefreshCw color="#fff" size={18} />
              </TouchableOpacity>
            </View>
            <Text style={styles.helperText}>ISBN do livro</Text>
          </View>

          {/* Título */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Título do Livro *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: O Senhor dos Anéis"
              placeholderTextColor="#94a3b8"
              value={formData.nome}
              onChangeText={(value) => handleChange('nome', value)}
            />
          </View>

          {/* Status */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Status de Leitura</Text>
            <View style={styles.statusContainer}>
              {['QUERO_LER', 'LENDO', 'LIDO'].map((status) => (
                <TouchableOpacity
                  key={status}
                  style={[
                    styles.statusButton,
                    formData.secoes === status && styles.statusButtonActive
                  ]}
                  onPress={() => handleChange('secoes', status)}
                >
                  <Text style={[
                    styles.statusButtonText,
                    formData.secoes === status && styles.statusButtonTextActive
                  ]}>
                    {status === 'QUERO_LER' ? 'Quero Ler' : status === 'LENDO' ? 'Lendo' : 'Já Li'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Progresso */}
          {formData.secoes === 'LENDO' && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Progresso: {formData.andamento}%</Text>
              <View style={styles.progressContainer}>
                <TouchableOpacity 
                  style={styles.progressButton}
                  onPress={() => handleChange('andamento', Math.max(0, formData.andamento - 10))}
                >
                  <Text style={styles.progressButtonText}>-</Text>
                </TouchableOpacity>
                <View style={styles.progressBarContainer}>
                  <View style={[styles.progressBar, { width: `${formData.andamento}%` }]} />
                  <Text style={styles.progressText}>{formData.andamento}%</Text>
                </View>
                <TouchableOpacity 
                  style={styles.progressButton}
                  onPress={() => handleChange('andamento', Math.min(100, formData.andamento + 10))}
                >
                  <Text style={styles.progressButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Botões */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.back()}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <View style={styles.buttonContent}>
                  <Save color="#fff" size={20} />
                  <Text style={styles.submitButtonText}>Salvar Alterações</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  loadingText: { color: '#94a3b8', marginTop: 12 },
  scrollView: { padding: 16 },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 24, borderWidth: 1, borderColor: '#334155' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 12 },
  iconBox: { backgroundColor: '#4f46e5', padding: 12, borderRadius: 8 },
  headerText: { flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  inputContainer: { marginBottom: 20 },
  labelRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#cbd5e1' },
  autoLoadingContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  autoLoadingText: { fontSize: 12, color: '#4f46e5', fontWeight: '500' },
  inputRow: { flexDirection: 'row', gap: 8 },
  input: { borderWidth: 1, borderColor: '#475569', borderRadius: 8, backgroundColor: '#334155', paddingVertical: 12, paddingHorizontal: 16, color: '#fff', fontSize: 16 },
  inputWithButton: { flex: 1 },
  refreshButton: { width: 48, height: 48, backgroundColor: '#4f46e5', borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  helperText: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  statusContainer: { flexDirection: 'row', gap: 8 },
  statusButton: { flex: 1, paddingVertical: 12, borderRadius: 8, borderWidth: 1, borderColor: '#475569', backgroundColor: '#334155', alignItems: 'center' },
  statusButtonActive: { backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
  statusButtonText: { color: '#94a3b8', fontSize: 12, fontWeight: '600' },
  statusButtonTextActive: { color: '#fff' },
  progressContainer: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  progressButton: { width: 40, height: 40, borderRadius: 8, backgroundColor: '#4f46e5', alignItems: 'center', justifyContent: 'center' },
  progressButtonText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  progressBarContainer: { flex: 1, height: 32, backgroundColor: '#334155', borderRadius: 4, justifyContent: 'center', paddingHorizontal: 8 },
  progressBar: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: '#4f46e5', borderRadius: 4 },
  progressText: { color: '#fff', fontSize: 12, fontWeight: '600', zIndex: 1, textAlign: 'center' },
  buttonContainer: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelButton: { flex: 1, backgroundColor: '#334155', paddingVertical: 14, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#475569' },
  cancelButtonText: { color: '#cbd5e1', fontSize: 16, fontWeight: '600' },
  submitButton: { flex: 1, backgroundColor: '#4f46e5', paddingVertical: 14, borderRadius: 8 },
  submitButtonDisabled: { opacity: 0.5 },
  buttonContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
