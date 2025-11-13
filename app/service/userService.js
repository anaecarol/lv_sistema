import * as storageService from './storageService';

// Ajuste conforme seu ambiente (variável de ambiente definida no bundler/expo)
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL_API || '';

async function requestJson(url, options = {}) {
  const res = await fetch(url, options);
  const json = await res.json().catch(() => ({ success: false, message: 'Resposta inválida do servidor' }));
  if (!res.ok) {
    const msg = json && json.message ? json.message : `HTTP ${res.status}`;
    return { success: false, message: msg, status: res.status, data: json.data };
  }
  return json;
}

export async function register({ nome, email, senha }) {
  if (!BASE_URL) throw new Error('BASE_URL não configurada');
  const url = `${BASE_URL}/usuario/register`;
  return await requestJson(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nome, email, senha })
  });
}

export async function getCurrentUser() {
  // lê usuário salvo localmente
  try {
    const u = await storageService.getItem('usuario');
    return u;
  } catch (e) {
    throw new Error('Falha ao obter usuário local: ' + (e.message || e));
  }
}

export async function fetchProfile() {
  // Exemplo: se precisar buscar perfil no servidor usando token
  if (!BASE_URL) throw new Error('BASE_URL não configurada');
  const token = await storageService.getItem('token');
  if (!token) throw new Error('Token não encontrado');
  const url = `${BASE_URL}/usuario/profile`;
  return await requestJson(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` }
  });
}

export default {
  register,
  getCurrentUser,
  fetchProfile
};