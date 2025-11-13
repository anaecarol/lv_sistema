import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Alert, ActivityIndicator } from 'react-native';
import * as userService from '../services/userService';

export default function Register({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!nome || !email || !senha) {
      Alert.alert('Aviso', 'Preencha todos os campos.');
      return;
    }
    setLoading(true);
    try {
      const res = await userService.register({ nome: nome.trim(), email: email.trim(), senha });
      if (res && res.success) {
        Alert.alert('Sucesso', res.message || 'Conta criada');
        setNome('');
        setEmail('');
        setSenha('');
        navigation.navigate('Login');
      } else {
        Alert.alert('Erro', (res && res.message) || 'Falha ao criar conta');
      }
    } catch (e) {
      Alert.alert('Erro', e.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar conta</Text>
      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />
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
          <Button title="Registrar" onPress={handleRegister} />
        )}
      </View>
      <View style={{ height: 12 }} />
      <Button title="Voltar para login" onPress={() => navigation.navigate('Login')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  input: { height: 48, borderColor: '#ccc', borderWidth: 1, paddingHorizontal: 10, marginBottom: 12, borderRadius: 6 },
  title: { fontSize: 24, marginBottom: 12, textAlign: 'center' }
});