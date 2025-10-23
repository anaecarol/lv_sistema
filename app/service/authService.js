import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL_API;

/** Faz login do usuário e retorna dados */
export async function loginUser(email, senha) {
  try {
    const res = await fetch(`${BASE_URL}/usuario/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });
    const json = await res.json();
    if (json.success) {
      await AsyncStorage.setItem('token', json.data.token);
      await AsyncStorage.setItem('usuario', JSON.stringify(json.data.usuario));
      return { success: true, message: json.message, usuario: json.data.usuario };
    } else {
      Alert.alert('Erro', json.message || 'Login falhou');
      return { success: false, message: json.message };
    }
  } catch (e) {
    Alert.alert('Erro', e.message);
    return { success: false, message: e.message };
  }
}

/** Faz logout limpando o token */
export async function logoutUser() {
  try {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('usuario');
    return true;
  } catch {
    Alert.alert('Erro', 'Não foi possível sair.');
    return false;
  }
}
