import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, ActivityIndicator } from 'react-native';
import * as authService from '../services/authService';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !senha) {
      Alert.alert('Aviso', 'Preencha email e senha.');
      return;
    }
    setLoading(true);
    try {
      const res = await authService.login(email.trim(), senha);
      if (res && res.success) {
        Alert.alert('Sucesso', res.message || 'Login realizado');
        setEmail('');
        setSenha('');
        navigation.reset({ index: 0, routes: [{ name: 'Home' }] });
      } else {
        Alert.alert('Erro', (res && res.message) || 'Falha no login');
      }
    } catch (e) {
      Alert.alert('Erro', e.message || 'Erro durante login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Faça login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        style={styles.input}
        secureTextEntry
      />
      <View style={{ marginTop: 8 }}>
        {loading ? (
          <ActivityIndicator size="small" />
        ) : (
          <Button title="Entrar" onPress={handleLogin} />
        )}
      </View>
      <View style={{ height: 12 }} />
      <Button title="Criar conta" onPress={() => navigation.navigate('Register')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  input: { height: 48, borderColor: '#ccc', borderWidth: 1, paddingHorizontal: 10, marginBottom: 12, borderRadius: 6 },
  title: { fontSize: 24, marginBottom: 12, textAlign: 'center' }
});