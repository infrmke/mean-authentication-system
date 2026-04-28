const HTTP_ERROR = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict', // indica "conflito" no estado atual de um recurso no servidor (ex.: duplicidade)
  429: 'Too Many Requests',
  500: 'Internal Server Error',
}

/**  Captura qualquer erro inesperado lançado em rotas, middlewares ou controllers.
 * Diferencia entre ambiente de produção e desenvolvimento.
 */
const errorHandler = (err, req, res, next) => {
  let status = err.status || 500
  let code = err.code || 'INTERNAL_SERVER_ERROR'
  let detail = err.message || 'An unexpected error occurred. Try again another time.'

  //  tratamento para o erro de duplicidade gerado pelo mongodb/mongoose
  if (err.code === 11000) {
    status = 409
    code = 'RESOURCE_ALREADY_EXISTS'
    detail = 'One or more records already exist.' // pode ser personalizado no catch(error) do controller
  }

  //  busca o nome do erro ou simplesmente usa 'Error'
  const title = HTTP_ERROR[status] || 'Error'

  //  log de erro
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack)
  }

  // header adequado conforme o RFC da IETF
  res.setHeader('Content-Type', 'application/problem+json')
  return res.status(status).json({
    status,
    error: title,
    detail,
    instance: req.originalUrl,
    // extensões personalizadas abaixo
    code,
    ...(err.errors ? { invalid_params: err.errors } : {}), // para os erros vindos do Zod
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : null),
  })
}

export default errorHandler
