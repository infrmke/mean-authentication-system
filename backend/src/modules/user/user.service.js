import userRepository from './user.repository.js'
import formatUserObject from '../../utils/formatUserObject.js'
import generateToken from '../../utils/generateToken.js'
import { sendEmail } from '../../config/nodemailer.js'
import { getWelcomeMailOptions } from '../../utils/generateMail.js'
import clearUserCache from '../../utils/clearUserCache.js'
import cache from '../../lib/cache.js'

class UserService {
  #userRepository

  constructor(userRepository) {
    this.#userRepository = userRepository
  }

  list = async (query) => {
    const cacheKey = `users_list_${JSON.stringify(query)}`

    // tenta buscar o resultado da requisição no cache primeiro
    const cachedData = cache.get(cacheKey)
    if (cachedData) return cachedData

    // se não houver cache, executa a lógica normal abaixo
    const page = Math.max(1, parseInt(query.page) || 1)
    const limit = Math.max(1, parseInt(query.limit) || 10)
    const offset = (page - 1) * limit

    const { users, totalItems } = await this.#userRepository.findAll(limit, offset)
    const formattedUsers = users.map((user) => formatUserObject(user))
    const totalPages = Math.ceil(totalItems / limit) // se existir 11 usuários e o limit for 10, haverá 2 páginas
    const currentPage = page

    const paginationData = {
      items: users,
      pagination: {
        totalItems,
        totalPages,
        currentPage,
        nextPage: currentPage < totalPages ? currentPage + 1 : null,
        prevPage: currentPage > 1 ? currentPage - 1 : null,
      },
    }

    cache.set(cacheKey, paginationData) // salva os dados no cache
    return paginationData
  }

  find = async (filter, projection = {}) => {
    const user = await this.#userRepository.findOne(filter, projection)
    if (!user) throwHttpError(400, 'User does not exist.', 'USER_NOT_FOUND')

    const formattedUser = formatUserObject(user)
    return { user, formattedUser }
  }

  show = async (id) => {
    const cacheKey = `user_id_${id}`

    // tenta buscar o resultado da requisição no cache primeiro
    const cachedData = cache.get(cacheKey)
    if (cachedData) return cachedData

    // se não houver cache, executa a lógica normal abaixo
    const user = await this.#userRepository.findById(id)
    if (!user) throwHttpError(400, 'User does not exist.', 'USER_NOT_FOUND')

    const formattedUser = formatUserObject(user)

    cache.set(cacheKey, formattedUser) // salva os dados no cache
    return { user, formattedUser }
  }

  store = async (data) => {
    const user = await this.#userRepository.create(data)
    if (!user) throwHttpError(500, 'Could not create user.')

    const accessToken = generateToken({ id: user._id }, process.env.JWT_ACCESS_SECRET, '1d')
    await sendEmail(getWelcomeMailOptions(data.name, data.email))

    clearUserCache() // limpa o cache para não retornar dados ultrapassados no próximo GET
    return { formattedUser: formatUserObject(user), accessToken }
  }

  update = async (id, data) => {
    const user = await this.#userRepository.update(id, data)
    if (!user) throwHttpError(400, 'User does not exist.', 'USER_NOT_FOUND')

    const formattedUser = formatUserObject(user)

    clearUserCache(id) // limpa o cache para não retornar dados ultrapassados no próximo GET
    return formattedUser
  }

  destroy = async (id) => {
    const user = await this.#userRepository.remove(id)
    if (!user) throwHttpError(400, 'User does not exist.', 'USER_NOT_FOUND')

    clearUserCache(id) // limpa o cache para não retornar dados ultrapassados no próximo GET
    return true
  }
}

export default new UserService(userRepository)
