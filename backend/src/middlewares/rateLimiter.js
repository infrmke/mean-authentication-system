import createLimiter from '../utils/createLimiter.js'

// proteção básica para o servidor inteiro
const globalLimiter = createLimiter(
  15,
  200,
  'Too many requests from this IP. Please try again in 15 minutes.',
)

// limitação para tentativas de login (POST sessions/login)
const sessionLimiter = createLimiter(
  15,
  5,
  'Too many login attempts. Please try again in 15 minutes.',
)

export { globalLimiter, sessionLimiter }
