import jwt from 'jsonwebtoken'

/**
 * Gera um token JWT.
 * @param {object} user - Objeto contendo dados do usuário.
 * @param {string} secret - Chave secreta utilizada para assinar o token. Deve sem uma string longa e aleatória.
 * @param {number} expirationTime - Tempo de expiração do token expresso em segundos ou uma string descrevendo um intervalo de tempo. Ex.: '120ms', '10h', '2d' ou apenas um número.
 * @returns {string} token para o usuário especificado.
 */
const generateToken = (user, secret, expirationTime) => {
  return jwt.sign(user, secret, {
    expiresIn: expirationTime,
  })
}

export default generateToken
