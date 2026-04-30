import otpService from './otp.service.js'
import throwHttpError from '../../utils/throwHttpError.js'

class OtpController {
  #otpService

  constructor(otpService) {
    this.#otpService = otpService
  }

  status = async (req, res, next) => {
    const status = await this.#otpService.showStatus(req.cookies.passwordToken)
    return res.status(200).json(status)
  }

  requestVerification = async (req, res, next) => {
    const { id } = req.params

    await this.#otpService.sendVerification(id)
    return res.status(200).json({ message: 'Code has been sent.' })
  }

  requestReset = async (req, res, next) => {
    const { email } = req.body

    await this.#otpService.sendReset({ email })
    return res.status(200).json({
      message: 'If the e-mail is registered, a code has been sent.',
    })
  }

  resendCode = async (req, res, next) => {
    const { email, type } = req.body
    const filter = type === 'VERIFY' ? { _id: req.user.id } : { email }

    await this.#otpService.resend(type, filter)
    return res.status(200).json({ message: 'A new code has been sent.' })
  }

  verifyEmail = async (req, res, next) => {
    const { id } = req.params
    const { otp } = req.body

    await this.#otpService.validateEmail(id, otp)
    return res.status(200).json({ message: 'E-mail verified successfully.' })
  }

  verifyReset = async (req, res, next) => {
    const { email, otp } = req.body

    const passwordToken = await this.#otpService.validateReset(otp, { email })

    res.cookie('passwordToken', passwordToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // usar TRUE em HTTPS
      sameSite: 'Lax',
      maxAge: 15 * 60 * 1000, // 15 minutos
    })

    return res.status(200).json({ message: 'Code has been verified. Proceed to password reset.' })
  }

  resetPassword = async (req, res, next) => {
    const { email, new_password } = req.body

    const user = await this.#otpService.resetPassword({ email }, new_password)

    res.clearCookie('passwordToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // usar TRUE em HTTPS
      sameSite: 'Lax',
    })

    return res.status(200).json(user)
  }
}

export default new OtpController(otpService)
