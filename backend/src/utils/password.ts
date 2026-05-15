import bcrypt from 'bcrypt'

/**
 * Gera uma senha de forma assíncrona.
 * @param {string} password - Senha fornecida.
 * @returns {promise} Senha hasheada.
 */
const generatePassword = async (password) => {
  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  return hash
}

/**
 * Compara senhas de forma assíncrona.
 * @param {string} givenPwd - Senha fornecida.
 * @param {string} storedPwd - Senha armazenada no banco de dados.
 * @returns {promise} true ou false.
 */
const validatePassword = async (givenPwd, storedPwd) =>
  await bcrypt.compare(givenPwd, storedPwd)

export { generatePassword, validatePassword }
