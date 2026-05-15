import userService from './user.service.js'
import throwHttpError from '../../utils/throwHttpError.js'

class UserController {
  #userService

  constructor(userService) {
    this.#userService = userService
  }

  getAll = async (req, res, next) => {
    const users = await this.#userService.list(req.query)
    return res.status(200).json(users)
  }

  getById = async (req, res, next) => {
    const { id } = req.params

    const user = await this.#userService.show(id)
    return res.status(200).json(user)
  }

  create = async (req, res, next) => {
    const { name, email, password } = req.body
    const data = { name, email, password }

    const { formattedUser, accessToken } = await this.#userService.store(data)

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // usar TRUE em HTTPS
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 dia
    })

    return res.status(201).json(formattedUser)
  }

  update = async (req, res, next) => {
    const { id } = req.params
    const { name, email, password } = req.body
    const updates = { name, email, password }

    const user = await this.#userService.update(id, updates)
    return res.status(200).json(user)
  }

  destroy = async (req, res, next) => {
    const { id } = req.params

    const user = await this.#userService.destroy(id)

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // usar TRUE em HTTPS
      sameSite: 'Lax',
    })

    return res.status(204).end()
  }
}

export default new UserController(userService)
