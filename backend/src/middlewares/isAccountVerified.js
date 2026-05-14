import UserService from '../modules/user/user.service.js'
import throwHttpError from '../utils/throwHttpError.js'

/**
 * Restringe o acesso apenas a usuários que realizaram a verificação de conta.
 */
const isAccountVerified = async (req, res, next) => {
  const { id } = req.user

  try {
    const user = await UserService.show(id)
    if (!user.isAccountVerified)
      throwHttpError(403, 'Account must be verified to perform this action')

    next()
  } catch (error) {
    next(error)
  }
}

export default isAccountVerified
