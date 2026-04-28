import throwHttpError from '../utils/throwHttpError.js'

/**
 * Verifica se o usuário autenticado é o proprietário da conta passada pelo ID na URL.
 */
const verifyOwnership = (req, res, next) => {
  if (req.params.id !== req.user.id.toString())
    throwHttpError(403, 'You can only modify your own account.', 'FORBIDDEN_ACTION')
  next()
}

export default verifyOwnership
