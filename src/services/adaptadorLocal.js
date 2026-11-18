/**
 * Adaptador local que imita a API REST usando localStorage.
 * Usado apenas no modo demonstração (sem VITE_API_URL).
 * Os dados iniciais são FICTÍCIOS — nenhum dado pessoal real.
 */
const CHAVE = 'ecocoleta:dados-demo'

function diasAtras(dias, hora = 10) {
  const d = new Date()
  d.setDate(d.getDate() - dias)
  d.setHours(hora, 0, 0, 0)
  return d.toISOString()
}

function dadosIniciais() {
  const moradores = [
    { id: '1', nome: 'Morador Exemplo A', bairro: 'Jardim Pery', criadoEm: diasAtras(20) },
    { id: '2', nome: 'Morador Exemplo B', bairro: 'Jardim Pery', criadoEm: diasAtras(15) },
    { id: '3', nome: 'Morador Exemplo C', bairro: 'Vila Nova Cachoeirinha', criadoEm: diasAtras(9) },
  ]
  const base = [
    ['1', 'plastico', 3.2, 'PEV-01 Jardim Pery', 12],
    ['1', 'aluminio', 0.8, 'PEV-01 Jardim Pery', 10],
    ['2', 'papelao', 6.5, 'PEV-02 Escola Municipal', 8],
    ['3', 'vidro', 4.0, 'PEV-03 Associação de Bairro', 6],
    ['2', 'plastico', 2.1, 'PEV-01 Jardim Pery', 3],
    ['1', 'papelao', 5.0, 'PEV-01 Jardim Pery', 1],
  ]
  const fator = { plastico: 10, papelao: 5, aluminio: 25, vidro: 3 }
  const entregas = base.map(([moradorId, material, pesoKg, pev, dias], i) => ({
    id: String(i + 1),
    moradorId,
    material,
    pesoKg,
    pontos: Math.round(pesoKg * fator[material]),
    pev,
    origem: 'manual',
    criadoEm: diasAtras(dias, 9 + i),
  }))
  return { moradores, entregas }
}

function ler() {
  try {
    const salvo = localStorage.getItem(CHAVE)
    if (salvo) return JSON.parse(salvo)
  } catch {
    /* storage indisponível ou corrompido: recomeça com dados de exemplo */
  }
  const novo = dadosIniciais()
  gravar(novo)
  return novo
}

function gravar(dados) {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(dados))
  } catch {
    /* ignora: segue funcionando só em memória */
  }
}

const esperar = (ms = 250) => new Promise((r) => setTimeout(r, ms))

export function criarAdaptadorLocal() {
  return {
    async listar(recurso, filtros = {}) {
      await esperar()
      return ler()[recurso].filter((item) =>
        Object.entries(filtros).every(([k, v]) => String(item[k]) === String(v)),
      )
    },
    async buscar(recurso, id) {
      await esperar()
      return ler()[recurso].find((i) => i.id === String(id)) ?? null
    },
    async criar(recurso, dados) {
      await esperar()
      const db = ler()
      const proximoId = String(Math.max(0, ...db[recurso].map((i) => Number(i.id))) + 1)
      const novo = { ...dados, id: proximoId }
      db[recurso].push(novo)
      gravar(db)
      return novo
    },
    async atualizar(recurso, id, dados) {
      await esperar()
      const db = ler()
      db[recurso] = db[recurso].map((i) => (i.id === String(id) ? { ...i, ...dados, id: i.id } : i))
      gravar(db)
      return db[recurso].find((i) => i.id === String(id))
    },
    async excluir(recurso, id) {
      await esperar()
      const db = ler()
      db[recurso] = db[recurso].filter((i) => i.id !== String(id))
      gravar(db)
      return null
    },
  }
}
