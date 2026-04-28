import sessionService from './session.service.js'
import throwHttpError from '../../utils/throwHttpError.js'
import cache from '../../lib/cache.js'
import clearUserCache from '../../utils/clearUserCache.js'

class SessionController {
  #sessionService

  constructor(sessionService) {
    this.#sessionService = sessionService
  }

  show = async (req, res, next) => {
    const { id } = req.user

    try {
      const user = await this.#sessionService.verify(id)
      return res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  }

  login = async (req, res, next) => {
    const { email, password } = req.body

    try {
      const capsule = await this.#sessionService.authenticate(password, { email })
      const { formattedUser, accessToken } = capsule

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // usar TRUE em HTTPS
        sameSite: 'Lax',
        maxAge: 24 * 60 * 60 * 1000, // 1 dia
      })

      return res.status(200).json(formattedUser)
    } catch (error) {
      next(error)
    }
  }

  logout = async (req, res, next) => {
    try {
      this.#sessionService.terminate(req.user.id)

      res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // usar TRUE em HTTPS
        sameSite: 'Lax',
      })

      return res.status(200).json({ message: 'User has logged out.' })
    } catch (error) {
      next(error)
    }
  }
}

export default new SessionController(sessionService)
