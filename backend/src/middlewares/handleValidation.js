import throwHttpError from '../utils/throwHttpError.js'

/**
 * Processa os resultados das validações do Zod.
 * Caso existam erros, interrompe a requisição e lança um erro formatado.
 */
const handleValidation = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    })

    next()
  } catch (error) {
    const formattedErrors = error.issues.map((issue) => ({
      field: issue.path.length > 1 ? issue.path[1] : issue.path[0], // pega o nome do campo que deu erro
      message: issue.message,
    }))
    throwHttpError(400, 'Validation failed', formattedErrors)
  }
}

export default handleValidation
