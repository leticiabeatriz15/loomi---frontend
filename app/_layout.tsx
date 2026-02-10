import { Stack } from 'expo-router';
import { AuthProvider } from '../contexts/AuthContext';

export const unstable_settings = {
  initialRouteName: 'index',
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="register" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="add-book" options={{ headerTitle: 'Adicionar Livro', headerShown: true }} />
      </Stack>
    </AuthProvider>
  );
}
