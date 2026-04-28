import userService from './user.service.js'
import throwHttpError from '../../utils/throwHttpError.js'
import cache from '../../lib/cache.js'
import clearUserCache from '../../utils/clearUserCache.js'

class UserController {
  #userService

  constructor(userService) {
    this.#userService = userService
  }

  getAll = async (req, res, next) => {
    try {
      const users = await this.#userService.list(req.query)
      return res.status(200).json(users)
    } catch (error) {
      next(error)
    }
  }

  getById = async (req, res, next) => {
    const { id } = req.params

    try {
      const capsule = await this.#userService.show(id)
      return res.status(200).json(capsule.formattedUser)
    } catch (error) {
      next(error)
    }
  }

  create = async (req, res, next) => {
    const { name, email, password } = req.body
    const data = { name, email, password }

    try {
      const { formattedUser, accessToken } = await this.#userService.store(data)

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // usar TRUE em HTTPS
        sameSite: 'Lax',
        maxAge: 24 * 60 * 60 * 1000, // 1 dia
      })

      return res.status(201).json(formattedUser)
    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0]

        error.code = 409
        error.message = `This ${field} is already in use.`
        error.code = 'USER_ALREADY_EXISTS'
      }

      next(error)
    }
  }

  update = async (req, res, next) => {
    const { id } = req.params
    const { name, email, password } = req.body
    const updates = { name, email, password }

    try {
      const user = await this.#userService.update(id, updates)
      return res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  }

  destroy = async (req, res, next) => {
    const { id } = req.params

    try {
      const user = await this.#userService.destroy(id)

      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // usar TRUE em HTTPS
        sameSite: 'Lax',
      })

      return res.status(204).end()
    } catch (error) {
      next(error)
    }
  }
}

export default new UserController(userService)
