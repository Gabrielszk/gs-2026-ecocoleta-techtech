import { api } from './apiClient'
import { calcularPontos } from '../lib/regras'
import { paraNumero } from '../lib/validacao'

const RECURSO = 'entregas'

/** Monta o registro aplicando a regra de pontos (o cliente nunca envia pontos "na mão"). */
function montar({ moradorId, material, pesoKg, pev }) {
  const peso = Math.round(paraNumero(pesoKg) * 100) / 100
  return {
    moradorId: String(moradorId),
    material,
    pesoKg: peso,
    pontos: calcularPontos(material, peso),
    pev,
  }
}

export const entregasService = {
  listar: () => api.listar(RECURSO),
  listarPorMorador: (moradorId) => api.listar(RECURSO, { moradorId: String(moradorId) }),
  criar: (dados) => api.criar(RECURSO, { ...montar(dados), criadoEm: new Date().toISOString() }),
  atualizar: (id, dados) => api.atualizar(RECURSO, id, { ...montar(dados), criadoEm: dados.criadoEm }),
  excluir: (id) => api.excluir(RECURSO, id),
}
