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
    const user = await this.#userService.show(id)
    cache.set(cacheKey, user, 120) // salva os dados no cache com TTL de 2 min
    return user
  }

  authenticate = async (password, filter) => {
    const user = await this.#userService.find(filter, '+password') // recebe um objeto user não formatado
    if (!(await validatePassword(password, user.password)))
      throwHttpError(400, 'Invalid credentials')

    const accessToken = generateToken({ id: user.id }, process.env.JWT_ACCESS_SECRET, '1d')

    clearUserCache(user._id) // limpa o cache para não retornar dados ultrapassados
    return { user: formatUserObject(user), accessToken } // formata o objeto user para não expor a senha
  }

  terminate = (id) => {
    if (id) clearUserCache(id)
  }
}

export default new SessionService(userService)
