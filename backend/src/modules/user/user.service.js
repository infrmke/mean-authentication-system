import userRepository from './user.repository.js'
import formatUserObject from '../../utils/formatUserObject.js'
import generateToken from '../../utils/generateToken.js'
import { sendEmail } from '../../config/nodemailer.js'
import { getWelcomeMailOptions } from '../../utils/generateMail.js'
import clearUserCache from '../../utils/clearUserCache.js'
import cache from '../../lib/cache.js'
import throwHttpError from '../../utils/throwHttpError.js'

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
    const page = Math.max(0, parseInt(query.page) || 0)
    const size = Math.max(1, parseInt(query.size) || 10)
    const sortParam = query.sort || 'createdAt,desc'

    // parse do sort
    const [field, direction] = sortParam.split(',')
    const sortOrder = direction === 'desc' ? -1 : 1

    const { users, totalElements } = await this.#userRepository.findAll({
      page,
      size,
      sortField: field,
      sortOrder,
    })

    // se existir 11 usuários e o size for 10, haverá 2 páginas
    const totalPages = Math.ceil(totalElements / size)

    const paginationData = {
      content: users.map((user) => formatUserObject(user)),
      first: page === 0,
      last: page >= totalPages - 1,
      number: page,
      numberOfElements: users.length,
      size,
      totalElements,
      totalPages,
    }

    cache.set(cacheKey, paginationData) // salva os dados no cache
    return paginationData
  }

  find = async (filter, projection = {}) => {
    const user = await this.#userRepository.findOne(filter, projection)
    if (!user) throwHttpError(400, 'User does not exist')

    if (projection === '+password') return user

    return formatUserObject(user)
  }

  show = async (id) => {
    const cacheKey = `user_id_${id}`

    // tenta buscar o resultado da requisição no cache primeiro
    const cachedData = cache.get(cacheKey)
    if (cachedData) return cachedData

    // se não houver cache, executa a lógica normal abaixo
    const user = await this.#userRepository.findById(id)
    if (!user) throwHttpError(400, 'User does not exist')

    const formattedUser = formatUserObject(user)

    cache.set(cacheKey, formattedUser) // salva os dados no cache
    return formattedUser
  }

  store = async (data) => {
    const user = await this.#userRepository.create(data)
    if (!user) throwHttpError(500, 'Could not create user')

    const accessToken = generateToken({ id: user._id }, process.env.JWT_ACCESS_SECRET, '1d')
    await sendEmail(getWelcomeMailOptions(data.name, data.email))

    clearUserCache() // limpa o cache para não retornar dados ultrapassados no próximo GET
    return { formattedUser: formatUserObject(user), accessToken }
  }

  update = async (id, data) => {
    const user = await this.#userRepository.update(id, data)
    if (!user) throwHttpError(400, 'User does not exist')

    const formattedUser = formatUserObject(user)

    clearUserCache(id) // limpa o cache para não retornar dados ultrapassados no próximo GET
    return formattedUser
  }

  destroy = async (id) => {
    const user = await this.#userRepository.remove(id)
    if (!user) throwHttpError(400, 'User does not exist')

    clearUserCache(id) // limpa o cache para não retornar dados ultrapassados no próximo GET
    return true
  }
}

export default new UserService(userRepository)
