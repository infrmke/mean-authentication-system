import sessionService from './session.service.js'
import throwHttpError from '../../utils/throwHttpError.js'

class SessionController {
  #sessionService

  constructor(sessionService) {
    this.#sessionService = sessionService
  }

  status = async (req, res, next) => {
    const { id } = req.user

    const user = await this.#sessionService.showStatus(id)
    return res.status(200).json(user)
  }

  login = async (req, res, next) => {
    const { email, password } = req.body

    const capsule = await this.#sessionService.authenticate(password, { email })
    const { user, accessToken } = capsule

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // usar TRUE em HTTPS
      sameSite: 'Lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 dia
    })

    return res.status(200).json(user)
  }

  logout = async (req, res, next) => {
    this.#sessionService.terminate(req.user.id)

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // usar TRUE em HTTPS
      sameSite: 'Lax',
    })

    return res.status(204).end()
  }
}

export default new SessionController(sessionService)
