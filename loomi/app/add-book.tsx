import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, BookPlus } from 'lucide-react-native';
import { livroService } from '../services/api';

export default function AddBookPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    isbn: '',
    nome: '',
    secoes: 'QUERO_LER',
    andamento: 0
  });

  const handleChange = (name: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [name]: name === 'andamento' ? parseInt(value.toString()) : value
    }));
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
      console.log('📤 Enviando livro para o backend:', formData);
      await livroService.criarLivro(formData);
      console.log('✅ Livro adicionado com sucesso!');
      Alert.alert('Sucesso', 'Livro adicionado com sucesso!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error: any) {
      console.error('❌ Erro ao adicionar livro:', error);
      if (error.code === 'ERR_NETWORK') {
        Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor.');
      } else {
        Alert.alert('Erro', 'Erro ao adicionar livro');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.card}>
          <View style={styles.header}>
            <View style={styles.iconBox}>
              <BookPlus color="#fff" size={24} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>Adicionar Livro</Text>
              <Text style={styles.subtitle}>Adicione um novo livro à sua estante</Text>
            </View>
          </View>

          {/* ISBN */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>ISBN *</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: 978-8532519825"
              placeholderTextColor="#94a3b8"
              value={formData.isbn}
              onChangeText={(value) => handleChange('isbn', value)}
            />
            <Text style={styles.helperText}>ISBN do livro (identificador único)</Text>
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

          {/* Botão */}
          <TouchableOpacity
            style={[styles.submitButton, loading && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.buttonContent}>
                <BookPlus color="#fff" size={20} />
                <Text style={styles.submitButtonText}>Adicionar à Estante</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  scrollView: { padding: 16 },
  card: { backgroundColor: '#1e293b', borderRadius: 12, padding: 24, borderWidth: 1, borderColor: '#334155' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 24, gap: 12 },
  iconBox: { backgroundColor: '#4f46e5', padding: 12, borderRadius: 8 },
  headerText: { flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  subtitle: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  inputContainer: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#cbd5e1', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#475569', borderRadius: 8, backgroundColor: '#334155', paddingVertical: 12, paddingHorizontal: 16, color: '#fff', fontSize: 16 },
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
  submitButton: { backgroundColor: '#4f46e5', paddingVertical: 14, borderRadius: 8, marginTop: 8 },
  submitButtonDisabled: { opacity: 0.5 },
  buttonContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
