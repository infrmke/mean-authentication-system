import jwt from 'jsonwebtoken'
import throwHttpError from '../utils/throwHttpError.js'

const isEnvDev = process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'development'

/**
 * Verifica a integridade de um web token json lendo-o do cookie httpOnly de acordo com o ambiente.
 */
const verifyAccessToken = (req, res, next) => {
  const { accessToken } = req.cookies

  if (!accessToken) {
    throwHttpError(401, isEnvDev ? 'Access denied. Missing token' : 'Access denied')
  }

  try {
    const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)
    req.user = { ...req.user, ...payload }
    next()
  } catch (error) {
    // personalizando outros erros para serem estritamente 401 (Unauthorized)
    error.status = 401
    error.code = 'INVALID_TOKEN'

    if (error.name === 'TokenExpiredError') {
      error.status = 403
      error.code = 'EXPIRED_TOKEN'
      error.message = isEnvDev ? 'Access denied. Expired token' : 'Session expired'
    } else {
      error.message = isEnvDev ? 'Access denied. Invalid token' : 'Access denied'
    }

    next(error)
  }
}

export default verifyAccessToken
