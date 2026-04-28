import NodeCache from 'node-cache'

/**
 * Instância do cache. `stdTTL` é o tempo padrão de vida (5 minutos) e `checkperiod`
 * é o tempo para deletar itens expirados (2 minutos).
 */
const cache = new NodeCache({ stdTTL: 300, checkperiod: 120 })

export default cache
