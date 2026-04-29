import otpService from './otp.service.js'
import throwHttpError from '../../utils/throwHttpError.js'
import cache from '../../lib/cache.js'

class OtpController {
  #otpService

  constructor(otpService) {
    this.#otpService = otpService
  }

  status = async (req, res, next) => {
    try {
      const status = await this.#otpService.showStatus(req.cookies.passwordToken)
      return res.status(200).json(status)
    } catch (error) {
      next(error)
    }
  }

  requestVerification = async (req, res, next) => {
    const { id } = req.params

    try {
      await this.#otpService.sendVerification(id)
      return res.status(200).json({ message: 'Code has been sent.' })
    } catch (error) {
      if (error.code === 11000) {
        error.status = 409
        error.message = 'An active e-mail code has already been sent to this account.'
        error.code = 'OTP_ALREADY_SENT'
      }

      next(error)
    }
  }

  requestReset = async (req, res, next) => {
    const { email } = req.body

    try {
      await this.#otpService.sendReset({ email })
      return res.status(200).json({
        message: 'If the e-mail is registered, a code has been sent.',
      })
    } catch (error) {
      if (error.code === 11000) {
        error.status = 409
        error.message = 'An active password reset code has already been sent to this account.'
        error.code = 'OTP_ALREADY_SENT'
      }

      next(error)
    }
  }

  resendCode = async (req, res, next) => {
    const { email, type } = req.body
    const filter = type === 'VERIFY' ? { _id: req.user.id } : { email }

    try {
      await this.#otpService.resend(type, filter)
      return res.status(200).json({ message: 'A new code has been sent.' })
    } catch (error) {
      next(error)
    }
  }

  verifyEmail = async (req, res, next) => {
    const { id } = req.params
    const { otp } = req.body

    try {
      await this.#otpService.validateEmail(id, otp, 'VERIFY')
      return res.status(200).json({ message: 'E-mail verified successfully.' })
    } catch (error) {
      next(error)
    }
  }

  verifyReset = async (req, res, next) => {
    const { email, otp } = req.body

    try {
      const passwordToken = await this.#otpService.validateReset(otp, 'RESET', {
        email,
      })

      res.cookie('passwordToken', passwordToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // usar TRUE em HTTPS
        sameSite: 'Lax',
        maxAge: 15 * 60 * 1000, // 15 minutos
      })

      return res.status(200).json({ message: 'Code has been verified. Proceed to password reset.' })
    } catch (error) {
      next(error)
    }
  }

  resetPassword = async (req, res, next) => {
    const { email, new_password } = req.body

    try {
      const user = await this.#otpService.resetPassword({ email }, new_password)

      res.clearCookie('passwordToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // usar TRUE em HTTPS
        sameSite: 'Lax',
      })

      return res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  }
}

export default new OtpController(otpService)
