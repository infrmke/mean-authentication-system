import jwt from 'jsonwebtoken'
import throwHttpError from '../utils/throwHttpError.js'

const isEnvDev = process.env.NODE_ENV === 'dev' || process.env.NODE_ENV === 'development'

/**
 * Middleware para autorizar a redefinição de senha.
 * Verifica se o cookie "passwordToken" (gerado após validar o OTP) é válido.
 */
const verifyPasswordToken = (req, res, next) => {
  const { passwordToken } = req.cookies

  if (!passwordToken) {
    throwHttpError(
      401,
      isEnvDev ? 'Session expired or missing password token' : 'Unauthorized action',
    )
  }

  try {
    jwt.verify(passwordToken, process.env.JWT_RESET_SECRET)
    next()
  } catch (error) {
    // personalizando outros erros para serem estritamente 401 (Unauthorized)
    error.status = 401

    if (error.name === 'TokenExpiredError') {
      error.status = 403
      error.message = isEnvDev ? 'The password reset session has expired' : 'Session expired'
    } else {
      error.message = isEnvDev ? 'Invalid password token' : 'Unauthorized action'
    }

    next(error)
  }
}

export default verifyPasswordToken
