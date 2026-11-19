/**
 * Regras de negócio do EcoColeta SP.
 * Funções puras: não acessam API nem React.
 *
 * Valores de preço e CO2 são ESTIMATIVAS SIMULADAS para o protótipo,
 * baseadas em ordens de grandeza de referências públicas do setor.
 */

export const MATERIAIS = {
  plastico: { nome: 'Plástico', pontosPorKg: 10, precoKg: 1.8, co2EvitadoKg: 1.5, cor: 'bg-plastico' },
  papelao: { nome: 'Papelão', pontosPorKg: 5, precoKg: 0.6, co2EvitadoKg: 0.9, cor: 'bg-papelao' },
  aluminio: { nome: 'Alumínio', pontosPorKg: 25, precoKg: 6.5, co2EvitadoKg: 9.0, cor: 'bg-aluminio' },
  vidro: { nome: 'Vidro', pontosPorKg: 3, precoKg: 0.2, co2EvitadoKg: 0.3, cor: 'bg-vidro' },
}

export const CHAVES_MATERIAIS = Object.keys(MATERIAIS)

/** Meta mensal de reciclagem do bairro piloto (kg). */
export const META_MENSAL_BAIRRO_KG = 500

/** Peso máximo aceito por entrega (capacidade da balança do PEV). */
export const PESO_MAX_KG = 48

/** Pontos de entrega (PEVs) do bairro piloto. Dados simulados. */
export const PEVS = ['PEV-01 Jardim Pery', 'PEV-02 Escola Municipal', 'PEV-03 Associação de Bairro']

/** Benefícios do comércio local parceiro (simulados). */
export const RECOMPENSAS = [
  { id: 'pao', nome: '5 pães franceses', parceiro: 'Padaria do Bairro', custo: 50 },
  { id: 'cafe', nome: 'Café + pão na chapa', parceiro: 'Padaria do Bairro', custo: 120 },
  { id: 'farmacia', nome: '10% em itens de higiene', parceiro: 'Farmácia Popular da Vila', custo: 200 },
  { id: 'mercado', nome: 'R$ 15 em compras', parceiro: 'Mercadinho Bom Preço', custo: 400 },
]

export function calcularPontos(material, pesoKg) {
  const regra = MATERIAIS[material]
  if (!regra || !Number.isFinite(pesoKg) || pesoKg <= 0) return 0
  return Math.round(pesoKg * regra.pontosPorKg)
}

export function calcularCo2Evitado(material, pesoKg) {
  const regra = MATERIAIS[material]
  if (!regra || !Number.isFinite(pesoKg)) return 0
  return pesoKg * regra.co2EvitadoKg
}

/** Soma os indicadores de uma lista de entregas. */
export function resumirEntregas(entregas) {
  const porMaterial = Object.fromEntries(CHAVES_MATERIAIS.map((m) => [m, 0]))
  let totalKg = 0
  let totalPontos = 0
  let co2Kg = 0
  let valorEstimado = 0

  for (const e of entregas) {
    const peso = Number(e.pesoKg) || 0
    if (!MATERIAIS[e.material]) continue
    porMaterial[e.material] += peso
    totalKg += peso
    totalPontos += Number(e.pontos) || 0
    co2Kg += calcularCo2Evitado(e.material, peso)
    valorEstimado += peso * MATERIAIS[e.material].precoKg
  }

  return { porMaterial, totalKg, totalPontos, co2Kg, valorEstimado, quantidade: entregas.length }
}

/** Entregas feitas no mês corrente. */
export function entregasDoMes(entregas, referencia = new Date()) {
  return entregas.filter((e) => {
    const d = new Date(e.criadoEm)
    return d.getMonth() === referencia.getMonth() && d.getFullYear() === referencia.getFullYear()
  })
}

/** Próxima recompensa que o morador ainda não alcançou. */
export function proximaRecompensa(saldo) {
  return RECOMPENSAS.find((r) => r.custo > saldo) ?? null
}

/** Percentual limitado entre 0 e 100. */
export function percentual(valor, total) {
  if (!total) return 0
  return Math.min(100, Math.max(0, (valor / total) * 100))
}

// ---------- Formatação (pt-BR) ----------
const fmtKg = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 })
const fmtReal = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const fmtData = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

export const formatarKg = (v) => `${fmtKg.format(v || 0)} kg`
export const formatarReais = (v) => fmtReal.format(v || 0)
export const formatarData = (iso) => (iso ? fmtData.format(new Date(iso)) : '—')
