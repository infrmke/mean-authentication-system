import jwt from 'jsonwebtoken'
import throwHttpError from '../utils/throwHttpError.js'

const isEnvDev = process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'development'

/**
 * Verifica a integridade de um web token json lendo-o do cookie httpOnly de acordo com o ambiente.
 */
const verifyAccessToken = (req, res, next) => {
  const { accessToken } = req.cookies

  if (!accessToken) {
    throwHttpError(401, isEnvDev ? 'Token not found' : 'Access denied')
  }

  try {
    const payload = jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET)
    req.user = { ...req.user, ...payload }
    next()
  } catch (error) {
    // personalizando outros erros para serem estritamente 401 (Unauthorized)
    error.status = 401

    if (error.name === 'TokenExpiredError') {
      error.status = 403
      error.message = isEnvDev ? 'Token has expired' : 'Session expired'
    } else {
      error.message = isEnvDev ? 'Invalid token' : 'Access denied'
    }

    next(error)
  }
}

export default verifyAccessToken
