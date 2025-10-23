const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL_API;
import { Alert } from 'react-native';

/** Cadastra um novo usuário */
export async function registerUser({ nome, email, senha, cargo, avatar }) {
  try {
    const res = await fetch(`${BASE_URL}/usuario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email, senha, cargo, avatar }),
    });
    const json = await res.json();
    if (json.success) {
      Alert.alert('Sucesso', json.message);
      return { success: true, message: json.message };
    } else {
      Alert.alert('Erro', json.message || 'Falha no cadastro');
      return { success: false, message: json.message };
    }
  } catch (e) {
    Alert.alert('Erro', e.message);
    return { success: false, message: e.message };
  }
}
