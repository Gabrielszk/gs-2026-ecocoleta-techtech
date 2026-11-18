/**
 * Cliente HTTP da API externa (MockAPI.io).
 * A URL vem da variável de ambiente VITE_API_URL (ver .env.example).
 *
 * Sem a variável configurada, o app entra em "modo demonstração" e usa um
 * adaptador local (localStorage) com a MESMA interface REST, para que o
 * protótipo continue utilizável offline. A UI avisa quando isso acontece.
 */
import { criarAdaptadorLocal } from './adaptadorLocal'

const BASE_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '')

export const modoDemonstracao = !BASE_URL

export class ErroApi extends Error {
  constructor(mensagem, status) {
    super(mensagem)
    this.name = 'ErroApi'
    this.status = status
  }
}

async function requisicao(caminho, { method = 'GET', body } = {}) {
  let resposta
  try {
    resposta = await fetch(`${BASE_URL}${caminho}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new ErroApi('Sem conexão com o servidor. Verifique sua internet.', 0)
  }

  // MockAPI responde 404 com "Not found" quando um filtro não encontra nada.
  if (resposta.status === 404 && method === 'GET' && caminho.includes('?')) return []
  if (!resposta.ok) {
    throw new ErroApi(`O servidor respondeu com erro (${resposta.status}).`, resposta.status)
  }
  return resposta.status === 204 ? null : resposta.json()
}

const clienteRemoto = {
  listar: (recurso, filtros) => {
    const qs = filtros ? `?${new URLSearchParams(filtros)}` : ''
    return requisicao(`/${recurso}${qs}`)
  },
  buscar: (recurso, id) => requisicao(`/${recurso}/${id}`),
  criar: (recurso, dados) => requisicao(`/${recurso}`, { method: 'POST', body: dados }),
  atualizar: (recurso, id, dados) => requisicao(`/${recurso}/${id}`, { method: 'PUT', body: dados }),
  excluir: (recurso, id) => requisicao(`/${recurso}/${id}`, { method: 'DELETE' }),
}

export const api = modoDemonstracao ? criarAdaptadorLocal() : clienteRemoto
