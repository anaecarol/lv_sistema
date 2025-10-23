import AsyncStorage from '@react-native-async-storage/async-storage';

/** Retorna usuário logado do AsyncStorage */
export async function getStoredUser() {
  try {
    const userLogin = await AsyncStorage.getItem('usuario');
    return userLogin ? JSON.parse(userLogin) : null;
  } catch {
    return null;
  }
}

/** Retorna token armazenado */
export async function getToken() {
  try {
    return await AsyncStorage.getItem('token');
  } catch {
    return null;
  }
}
