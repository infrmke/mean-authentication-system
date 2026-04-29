import userService from '../user/user.service.js'
import otpRepository from './otp.repository.js'
import throwHttpError from '../../utils/throwHttpError.js'
import formatUserObject from '../../utils/formatUserObject.js'
import generateToken from '../../utils/generateToken.js'
import { createOtpOptions } from '../../utils/generateOtp.js'
import { getOtpMailOptions } from '../../utils/generateMail.js'
import { sendEmail } from '../../config/nodemailer.js'
import cache from '../../lib/cache.js'
import clearUserCache from '../../utils/clearUserCache.js'

class OtpService {
  #otpRepository
  #userService

  constructor(otpRepository, userService) {
    this.#otpRepository = otpRepository
    this.#userService = userService
  }

  // utilitário para busca avançada de usuário
  #getUserByFilter = async (filter, projection) => {
    const capsule = await this.#userService.find(filter, projection)
    return capsule.user
  }

  showStatus = async (token) => {
    const identifier = token.split('.')[1]
    const cacheKey = `password_reset_${identifier}`

    // tenta buscar o resultado da requisição no cache primeiro
    const cachedData = cache.get(cacheKey)
    if (cachedData) return cachedData

    // se não houver cache, executa a lógica normal abaixo
    const resetStatus = { active: true, message: 'The password reset session is active.' }

    cache.set(cacheKey, resetStatus) // salva os dados no cache
    return resetStatus
  }

  sendVerification = async (id) => {
    const capsule = await this.#userService.show(id)
    const { user } = capsule

    if (user.isAccountVerified)
      throwHttpError(403, 'Account has already been verified.', 'FORBIDDEN_ACTION')

    try {
      const otpOptions = createOtpOptions(user._id, 'VERIFY')
      const newOtp = await this.#otpRepository.create(otpOptions)
      await sendEmail(getOtpMailOptions(user.email, newOtp.code, 'VERIFY'))
    } catch (error) {
      if (error.code === 11000)
        throwHttpError(
          409,
          'An active e-mail code has already been sent to this account.',
          'OTP_ALREADY_SENT',
        )
      throw error // repassa outros erros inesperados
    }
  }

  sendReset = async (filter) => {
    try {
      const user = await this.#getUserByFilter(filter)
      const otpOptions = createOtpOptions(user._id, 'RESET')
      const newOtp = await this.#otpRepository.create(otpOptions)
      await sendEmail(getOtpMailOptions(user.email, newOtp.code, 'RESET'))
    } catch (error) {
      if (error.code === 'USER_NOT_FOUND') return // não avisa que o usuário não foi encontrado

      if (error.code === 11000)
        throwHttpError(
          409,
          'An active password reset code has already been sent to this account.',
          'OTP_ALREADY_SENT',
        )
      throw error // repassa outros erros inesperados
    }
  }

  resend = async (type, filter) => {
    const user = await this.#getUserByFilter(filter)

    // verifica se o cooldown de 60s está ativo
    const cooldownKey = `otp_cooldown_${type}_${user._id}`
    if (cache.has(cooldownKey))
      throwHttpError(429, 'Wait 60s before requesting a new code.', 'OTP_COOLDOWN_TIME')

    // deleta o OTP previamente gerado
    await this.#otpRepository.remove(user._id, type)

    if (type === 'VERIFY') await this.sendVerification(user._id)
    else await this.sendReset({ email: user.email })

    cache.set(cooldownKey, true, 60) // ativa o cooldown no cache
  }

  validateEmail = async (id, otp, otpType) => {
    const capsule = await this.#userService.show(id)
    const { user } = capsule

    if (user.isAccountVerified)
      throwHttpError(403, 'Account has already been verified.', 'FORBIDDEN_ACTION')

    const otpDocument = await this.#otpRepository.findById(user._id, 'VERIFY')
    if (!otpDocument) throwHttpError(500, 'Could not verify code. Try again later.')

    if (!otpDocument.code || otp !== otpDocument.code || otpType !== otpDocument.type)
      throwHttpError(403, 'Invalid code.', 'OTP_NOT_FOUND')

    await this.#userService.update(user._id, {
      isAccountVerified: true,
    })
    await this.#otpRepository.remove(id, 'VERIFY')

    clearUserCache(user._id) // limpa o cache para não retornar dados ultrapassados no próximo GET
  }

  validateReset = async (otp, otpType, filter) => {
    const user = await this.#getUserByFilter(filter)

    const otpDocument = await this.#otpRepository.findById(user._id, 'RESET')
    if (!otpDocument) throwHttpError(500, 'Could not verify code. Try again later.')

    if (!otpDocument.code || otp !== otpDocument.code || otpType !== otpDocument.type)
      throwHttpError(403, 'Invalid code.', 'OTP_NOT_FOUND')
    await this.#otpRepository.remove(user._id, 'RESET')

    const passwordToken = generateToken({ id: user._id }, process.env.JWT_RESET_SECRET, '15m')
    return passwordToken
  }

  resetPassword = async (filter, password) => {
    const user = await this.#getUserByFilter(filter, '+password')
    await this.#userService.update(user._id, { password })

    clearUserCache(user._id) // limpa o cache para não retornar dados ultrapassados no próximo GET
    return updatedUser
  }
}

export default new OtpService(otpRepository, userService)
