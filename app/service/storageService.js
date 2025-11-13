import AsyncStorage from '@react-native-async-storage/async-storage';

export async function setItem(key, value) {
  try {
    const v = typeof value === 'string' ? value : JSON.stringify(value);
    await AsyncStorage.setItem(key, v);
    return true;
  } catch (e) {
    throw new Error('Falha ao salvar dados: ' + (e.message || e));
  }
}

export async function getItem(key) {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (raw === null) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  } catch (e) {
    throw new Error('Falha ao obter dados: ' + (e.message || e));
  }
}

export async function removeItem(key) {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (e) {
    throw new Error('Falha ao remover dados: ' + (e.message || e));
  }
}

export async function clearAll() {
  try {
    await AsyncStorage.clear();
    return true;
  } catch (e) {
    throw new Error('Falha ao limpar armazenamento: ' + (e.message || e));
  }
}

export default {
  setItem,
  getItem,
  removeItem,
  clearAll
};