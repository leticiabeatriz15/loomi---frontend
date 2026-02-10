import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { User, BookOpen } from 'lucide-react-native';

export default function ProfilePage() {
  const { usuario } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <User color="#fff" size={48} />
          </View>
        </View>
        
        <Text style={styles.name}>{usuario?.nome || 'Usuário'}</Text>
        <Text style={styles.subtitle}>Membro do Loomi</Text>

        <View style={styles.infoContainer}>
          <BookOpen color="#4f46e5" size={24} />
          <Text style={styles.infoText}>
            Bem-vindo à sua estante virtual!{'\n'}
            Organize seus livros de forma simples e prática.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    padding: 16,
  },
  card: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 32,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#4f46e5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 24,
  },
  infoContainer: {
    backgroundColor: '#4f46e520',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  infoText: {
    flex: 1,
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 20,
  },
});
