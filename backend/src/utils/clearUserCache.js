import cache from '../lib/cache.js'

/**
 * Limpa chaves de cache relacionadas a um usuário específico ou listas globais.
 * @param {string} userId - ID do usuário para limpar sessões e/ou perfil individual.
 */
const clearUserCache = (userId = null) => {
  const allCacheKeys = cache.keys()

  // chave da lista GET /users
  const listKeys = allCacheKeys.filter((key) => key.startsWith('users_list'))
  if (listKeys.length > 0) cache.del(listKeys)

  // chaves de GET /users/:id e GET /sessions/me
  if (userId) {
    cache.del(`user_id_${userId}`)
    cache.del(`user_session_${userId}`)
  }
}

export default clearUserCache
