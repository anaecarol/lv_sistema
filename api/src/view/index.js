
import * as responses from '../utils/responses.js';

/**
 * View adapter — mapeia para utils/responses.js
 *
 * result(res, method, data, message)
 * erro(res, error)
 */

export const result = (res, method = 'GET', data = null, message = null) => {
  // Define status code by method
  let statusCode = 200;
  if (method === 'POST') statusCode = 201;
  if (method === 'DELETE') statusCode = 200;
  if (method === 'PUT') statusCode = 200;
  if (method === 'PATCH') statusCode = 200;

  // message fallback
  if (!message) {
    if (method === 'POST') message = 'Recurso criado com sucesso';
    else if (method === 'DELETE') message = 'Recurso removido';
    else message = 'Operação realizada com sucesso';
  }

  // quantidade de registros
  let quant_rows = null;
  if (Array.isArray(data)) quant_rows = data.length;

  return responses.sendResponse(res, { success: true, statusCode, message, data, quant_rows });
};

export const erro = (res, error = {}) => {
  // error pode ser object com statusCode/message
  const statusCode = error.statusCode || error.status || 500;
  const message = error.mensagem || error.message || 'Erro interno do servidor';
  const data = error.data ?? null;
  return responses.error(res, { statusCode, message, data });
};

export default { result, erro };
