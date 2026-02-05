import { Tabs, useRouter } from 'expo-router';
import React from 'react';
import { TouchableOpacity, Alert } from 'react-native';
import { BookOpen, User, LogOut } from 'lucide-react-native';
import { useAuth } from '../../contexts/AuthContext';

export default function TabLayout() {
  const { logout, usuario } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Deseja realmente sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/login');
          }
        }
      ]
    );
  };

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#4f46e5',
        headerShown: true,
        headerStyle: {
          backgroundColor: '#1e293b',
        },
        headerTintColor: '#fff',
        tabBarStyle: {
          backgroundColor: '#1e293b',
          borderTopColor: '#334155',
        },
        headerRight: () => (
          <TouchableOpacity 
            onPress={handleLogout}
            style={{ marginRight: 16 }}
          >
            <LogOut color="#fff" size={24} />
          </TouchableOpacity>
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Loomi',
          tabBarIcon: ({ color }) => <BookOpen color={color} size={28} />,
          tabBarLabel: 'Estante',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color }) => <User color={color} size={28} />,
          tabBarLabel: usuario?.nome || 'Perfil',
        }}
      />
    </Tabs>
  );
}
