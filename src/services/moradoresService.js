import { api } from './apiClient'

const RECURSO = 'moradores'

export const moradoresService = {
  listar: () => api.listar(RECURSO),
  buscar: (id) => api.buscar(RECURSO, id),
  criar: ({ nome, bairro }) =>
    api.criar(RECURSO, { nome: nome.trim(), bairro: bairro.trim(), criadoEm: new Date().toISOString() }),
  atualizar: (id, { nome, bairro }) => api.atualizar(RECURSO, id, { nome: nome.trim(), bairro: bairro.trim() }),
  excluir: (id) => api.excluir(RECURSO, id),
}
