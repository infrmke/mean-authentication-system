import userService from '../user/user.service.js'
import throwHttpError from '../../utils/throwHttpError.js'
import generateToken from '../../utils/generateToken.js'
import { validatePassword } from '../../utils/password.js'
import formatUserObject from '../../utils/formatUserObject.js'
import cache from '../../lib/cache.js'
import clearUserCache from '../../utils/clearUserCache.js'

class SessionService {
  #userService

  constructor(userService) {
    this.#userService = userService
  }

  showStatus = async (id) => {
    const cacheKey = `user_session_${id}`

    // tenta buscar o resultado da requisição no cache primeiro
    const cachedData = cache.get(cacheKey)
    if (cachedData) return cachedData

    // se não houver cache, executa a lógica normal abaixo
    const capsule = await this.#userService.show(id)
    if (!capsule) throwHttpError(404, 'User session not found.', 'USER_NOT_FOUND')

    const { user } = capsule
    const formattedUser = formatUserObject(user)

    cache.set(cacheKey, user, 120) // salva os dados no cache com TTL de 2 min
    return formattedUser
  }

  authenticate = async (password, filter) => {
    const capsule = await this.#userService.find(filter, '+password')

    if (!capsule || !(await validatePassword(password, capsule.user.password))) {
      throwHttpError(400, 'Invalid credentials.', 'USER_INVALID_CREDENTIALS')
    }

    const { user } = capsule
    const formattedUser = formatUserObject(user)
    const accessToken = generateToken({ id: user._id }, process.env.JWT_ACCESS_SECRET, '1d')

    clearUserCache(formattedUser.id) // limpa o cache para não retornar dados ultrapassados
    return { formattedUser, accessToken }
  }

  terminate = (id) => {
    if (id) clearUserCache(id)
  }
}

export default new SessionService(userService)
