import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Search, Plus, Trash2, Edit } from 'lucide-react-native';
import { livroService } from '../../services/api';

interface Livro {
  id: string;
  isbn: string;
  nome: string;
  secoes: string;
  andamento: number;
}

export default function BookshelfPage() {
  const router = useRouter();
  const [livros, setLivros] = useState<Livro[]>([]);
  const [filtrados, setFiltrados] = useState<Livro[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  useFocusEffect(
    useCallback(() => {
      carregarLivros();
    }, [])
  );

  useEffect(() => {
    aplicarFiltros();
  }, [livros, searchTerm, statusFilter]);

  const carregarLivros = async () => {
    try {
      setLoading(true);
      console.log('📚 Carregando livros do backend...');
      const response = await livroService.listarLivros();
      console.log('✅ Livros carregados:', response.data.length, 'livros');
      setLivros(response.data || []);
    } catch (error: any) {
      console.error('❌ Erro ao carregar livros:', error);
      if (error.code === 'ERR_NETWORK') {
        Alert.alert('Erro de Conexão', 'Não foi possível conectar ao servidor. Verifique se o backend está rodando.');
      } else {
        Alert.alert('Erro', 'Erro ao carregar livros');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    carregarLivros();
  }, []);

  const aplicarFiltros = () => {
    let resultado = [...livros];

    if (statusFilter !== 'todos') {
      resultado = resultado.filter(livro => livro.secoes === statusFilter);
    }

    if (searchTerm) {
      resultado = resultado.filter(livro =>
        livro.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        livro.isbn?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFiltrados(resultado);
  };

  const handleDelete = async (id: string, nome: string) => {
    if (!id) {
      Alert.alert('Erro', 'ID do livro inválido');
      return;
    }
    
    Alert.alert(
      'Confirmar',
      `Tem certeza que deseja deletar "${nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Deletar',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🗑️ Deletando livro:', id);
              await livroService.deletarLivro(id);
              setLivros(livros.filter(livro => livro.id !== id));
              Alert.alert('Sucesso', 'Livro removido com sucesso!');
            } catch (error) {
              console.error('❌ Erro ao deletar livro:', error);
              Alert.alert('Erro', 'Erro ao deletar livro');
            }
          }
        }
      ]
    );
  };

  const stats = {
    total: livros.length,
    lendo: livros.filter(l => l.secoes === 'LENDO').length,
    lido: livros.filter(l => l.secoes === 'LIDO').length,
    queroLer: livros.filter(l => l.secoes === 'QUERO_LER').length
  };

  const getStatusBadge = (secoes: string) => {
    const statusMap: { [key: string]: string } = {
      'LENDO': 'Lendo',
      'LIDO': 'Lido',
      'QUERO_LER': 'Quero Ler'
    };
    return statusMap[secoes] || 'Quero Ler';
  };

  const getStatusColor = (secoes: string) => {
    const colorMap: { [key: string]: string } = {
      'LENDO': '#3b82f6',
      'LIDO': '#22c55e',
      'QUERO_LER': '#ec4899'
    };
    return colorMap[secoes] || '#ec4899';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4f46e5" />
        <Text style={styles.loadingText}>Conectando ao backend...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#4f46e5" />
        }
      >
        {/* Estatísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#4f46e5' }]}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#3b82f6' }]}>{stats.lendo}</Text>
            <Text style={styles.statLabel}>Lendo</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#22c55e' }]}>{stats.lido}</Text>
            <Text style={styles.statLabel}>Lidos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: '#ec4899' }]}>{stats.queroLer}</Text>
            <Text style={styles.statLabel}>Quero Ler</Text>
          </View>
        </View>

        {/* Busca */}
        <View style={styles.searchContainer}>
          <Search color="#94a3b8" size={20} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por título ou ISBN..."
            placeholderTextColor="#94a3b8"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
        </View>

        {/* Filtro */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScrollView}>
          {['todos', 'LENDO', 'LIDO', 'QUERO_LER'].map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                statusFilter === status && styles.filterButtonActive
              ]}
              onPress={() => setStatusFilter(status)}
            >
              <Text style={[
                styles.filterButtonText,
                statusFilter === status && styles.filterButtonTextActive
              ]}>
                {status === 'todos' ? 'Todos' : getStatusBadge(status)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Lista de Livros */}
        {filtrados.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {livros.length === 0 
                ? '📚 Nenhum livro na estante ainda.\nClique no + para adicionar seu primeiro livro!' 
                : 'Nenhum livro encontrado com os filtros selecionados'}
            </Text>
          </View>
        ) : (
          filtrados.map((livro) => (
            <View key={livro.id} style={styles.bookCard}>
              <View style={styles.bookHeader}>
                <View style={styles.bookInfo}>
                  <Text style={styles.bookTitle}>{livro.nome}</Text>
                  <Text style={styles.bookIsbn}>ISBN: {livro.isbn}</Text>
                </View>
                <View style={[styles.badge, { backgroundColor: getStatusColor(livro.secoes) + '20' }]}>
                  <Text style={[styles.badgeText, { color: getStatusColor(livro.secoes) }]}>
                    {getStatusBadge(livro.secoes)}
                  </Text>
                </View>
              </View>
              
              {livro.andamento > 0 && (
                <View style={styles.progressContainer}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressLabel}>Progresso</Text>
                    <Text style={styles.progressPercent}>{livro.andamento}%</Text>
                  </View>
                  <View style={styles.progressBarContainer}>
                    <View style={[styles.progressBar, { width: `${livro.andamento}%` }]} />
                  </View>
                </View>
              )}

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => router.push(`/edit-book?id=${livro.id}`)}
                >
                  <Edit color="#4f46e5" size={16} />
                  <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDelete(livro.id, livro.nome)}
                >
                  <Trash2 color="#ef4444" size={16} />
                  <Text style={styles.deleteButtonText}>Remover</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Botão Flutuante */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => router.push('/add-book')}
      >
        <Plus color="#fff" size={28} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  loadingText: { color: '#94a3b8', marginTop: 12 },
  scrollView: { padding: 16, paddingBottom: 80 },
  statsContainer: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  statCard: { flex: 1, backgroundColor: '#1e293b', padding: 16, borderRadius: 8, borderWidth: 1, borderColor: '#334155', alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold' },
  statLabel: { fontSize: 12, color: '#94a3b8', marginTop: 4 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1e293b', borderRadius: 8, borderWidth: 1, borderColor: '#334155', paddingHorizontal: 12, marginBottom: 16 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, paddingVertical: 12, color: '#fff', fontSize: 16 },
  filterScrollView: { marginBottom: 16 },
  filterButton: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8, backgroundColor: '#1e293b', borderWidth: 1, borderColor: '#334155', marginRight: 8 },
  filterButtonActive: { backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
  filterButtonText: { color: '#94a3b8', fontSize: 14, fontWeight: '600' },
  filterButtonTextActive: { color: '#fff' },
  bookCard: { backgroundColor: '#1e293b', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  bookHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  bookInfo: { flex: 1 },
  bookTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 4 },
  bookIsbn: { fontSize: 12, color: '#94a3b8' },
  badge: { paddingVertical: 4, paddingHorizontal: 12, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  progressContainer: { marginBottom: 12 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { fontSize: 12, color: '#cbd5e1', fontWeight: '600' },
  progressPercent: { fontSize: 12, color: '#94a3b8' },
  progressBarContainer: { height: 6, backgroundColor: '#334155', borderRadius: 3, overflow: 'hidden' },
  progressBar: { height: '100%', backgroundColor: '#4f46e5' },
  actionButtons: { flexDirection: 'row', gap: 8, marginTop: 4 },
  editButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#4f46e510', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, borderWidth: 1, borderColor: '#4f46e5', gap: 8 },
  editButtonText: { color: '#4f46e5', fontSize: 14, fontWeight: '600' },
  deleteButton: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ef444410', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 6, borderWidth: 1, borderColor: '#ef4444', gap: 8 },
  deleteButtonText: { color: '#ef4444', fontSize: 14, fontWeight: '600' },
  emptyContainer: { paddingVertical: 48, alignItems: 'center' },
  emptyText: { color: '#94a3b8', fontSize: 16, textAlign: 'center', lineHeight: 24 },
  fab: { position: 'absolute', right: 16, bottom: 16, width: 56, height: 56, borderRadius: 28, backgroundColor: '#4f46e5', justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4 },
});
