/**
 * Cria um objeto Error com um status HTTP personalizado. Também lança o erro.
 * @param {number} status - O código de status HTTP a ser retornado.
 * @param {string} message - A mensagem de erro. Mapeia para `detail` na RFC.
 * @param {string} code - Código para o sistema (ex: 'USER_NOT_FOUND').
 * @param {Array} details - (Opcional) Array de erros formatados do Zod. Mapeia para `invalid_params`.
 */
const throwHttpError = (status, message, code = 'INTERNAL_SERVER_ERROR', details = null) => {
  const error = new Error(message)
  error.status = status
  error.code = code

  if (details) error.errors = details // para o array de erros do Zod

  throw error
}

export default throwHttpError
