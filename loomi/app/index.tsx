import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function Index() {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      const inAuthGroup = segments[0] === '(tabs)';
      
      if (!isAuthenticated() && inAuthGroup) {
        // Redirecionar para login se não autenticado e tentando acessar área protegida
        router.replace('/login');
      } else if (isAuthenticated()) {
        // Redirecionar para tabs se já estiver autenticado
        router.replace('/(tabs)');
      } else {
        // Redirecionar para login se não autenticado
        router.replace('/login');
      }
    }
  }, [loading, isAuthenticated, segments]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#4f46e5" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f172a',
  },
});
