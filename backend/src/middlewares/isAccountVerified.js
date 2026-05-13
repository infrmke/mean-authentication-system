import UserService from '../modules/user/user.service.js'
import throwHttpError from '../utils/throwHttpError.js'

/**
 * Restringe o acesso apenas a usuários que realizaram a verificação de conta.
 */
const isAccountVerified = async (req, res, next) => {
  const { id } = req.user

  try {
    const capsule = await UserService.show(id)

    if (!capsule) {
      throwHttpError(404, 'User not found.')
    }

    if (!capsule.user.isAccountVerified) {
      throwHttpError(403, 'Account must be verified to perform this action.')
    }

    next()
  } catch (error) {
    next(error)
  }
}

export default isAccountVerified
