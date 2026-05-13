/**
 * Cria um objeto Error com um status HTTP personalizado. Também lança o erro.
 * @param {number} status - O código de status HTTP a ser retornado.
 * @param {string} message - A mensagem de erro. Mapeia para `detail` na RFC.
 * @param {Array} details - (Opcional) Array de erros formatados do Zod. Mapeia para `invalid_params`.
 */
const throwHttpError = (status, message, details = null) => {
  const error = new Error(message)
  error.status = status

  if (details) error.errors = details // para o array de erros do Zod

  throw error
}

export default throwHttpError
