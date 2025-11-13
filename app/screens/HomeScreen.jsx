import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import * as userService from '../services/userService';
import * as authService from '../services/authService';

export default function Home({ navigation }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadUser() {
      try {
        const u = await userService.getCurrentUser();
        if (mounted) setUsuario(u);
      } catch (e) {
        Alert.alert('Erro', e.message || 'Falha ao carregar usuário');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadUser();
    return () => { mounted = false; };
  }, []);

  async function handleLogout() {
    try {
      await authService.logout();
      navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
    } catch (e) {
      Alert.alert('Erro', e.message || 'Falha ao sair');
    }
  }

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Carregando...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo{usuario?.nome ? `, ${usuario.nome}` : ''}!</Text>
      {usuario && (
        <View style={styles.infoBox}>
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{usuario.email}</Text>
        </View>
      )}
      <View style={{ height: 12 }} />
      <Button title="Sair" onPress={handleLogout} color="#c00" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { fontSize: 24, marginBottom: 12, textAlign: 'center' },
  infoBox: { padding: 12, borderRadius: 8, backgroundColor: '#f2f2f2' },
  label: { fontWeight: '600' },
  value: { marginTop: 4 }
});