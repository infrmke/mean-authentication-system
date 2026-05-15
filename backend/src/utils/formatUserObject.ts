/**
 * Filtra e formata os dados do objeto `user`.
 * @param {Object} user - Instância ou objeto bruto do usuário.
 * @returns {Object} Dados públicos e formatados do usuário.
 */
const formatUserObject = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  isAccountVerified: user.isAccountVerified,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
})

export default formatUserObject
