import * as storageService from './storageService';

// Ajuste conforme seu ambiente (variável de ambiente definida no bundler/expo)
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL_API || '';

async function postJson(url, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });
  const json = await res.json().catch(() => ({ success: false, message: 'Resposta inválida do servidor' }));
  if (!res.ok) {
    // Tenta propagar mensagem do servidor
    const msg = json && json.message ? json.message : `HTTP ${res.status}`;
    return { success: false, message: msg, status: res.status, data: json.data };
  }
  return json;
}

export async function login(email, senha) {
  if (!BASE_URL) throw new Error('BASE_URL não configurada');
  const url = `${BASE_URL}/usuario/login`;
  const resp = await postJson(url, { email, senha });
  if (resp && resp.success && resp.data) {
    // armazena token e usuário localmente
    try {
      await storageService.setItem('token', resp.data.token);
      await storageService.setItem('usuario', resp.data.usuario || {});
    } catch (e) {
      // não impede o login, mas garante que o erro seja conhecido
      console.warn('Falha ao salvar dados locais após login:', e);
    }
  }
  return resp;
}

export async function logout() {
  // Opcional: informar servidor sobre logout se existir endpoint
  // Aqui apenas limpa o armazenamento local
  try {
    await storageService.removeItem('token');
    await storageService.removeItem('usuario');
    return true;
  } catch (e) {
    throw new Error('Falha ao deslogar: ' + (e.message || e));
  }
}

export default {
  login,
  logout
};