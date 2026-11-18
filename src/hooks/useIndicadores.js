import { useMemo } from 'react'
import {
  META_MENSAL_BAIRRO_KG,
  entregasDoMes,
  percentual,
  proximaRecompensa,
  resumirEntregas,
} from '../lib/regras'

/**
 * Custom hook: calcula os indicadores do bairro e de um morador a partir
 * das entregas. Fica memorizado para não recalcular a cada renderização.
 */
export function useIndicadores(entregas, moradores, moradorId = null) {
  return useMemo(() => {
    const geral = resumirEntregas(entregas)
    const doMes = resumirEntregas(entregasDoMes(entregas))
    const moradoresAtivos = new Set(entregas.map((e) => e.moradorId)).size

    const pontosPorMorador = {}
    for (const e of entregas) pontosPorMorador[e.moradorId] = (pontosPorMorador[e.moradorId] ?? 0) + (e.pontos || 0)

    const ranking = moradores
      .map((m) => ({ ...m, pontos: pontosPorMorador[m.id] ?? 0 }))
      .sort((a, b) => b.pontos - a.pontos)

    let morador = null
    if (moradorId) {
      const lista = entregas.filter((e) => e.moradorId === moradorId)
      const resumo = resumirEntregas(lista)
      morador = { ...resumo, entregas: lista, proxima: proximaRecompensa(resumo.totalPontos) }
    }

    return {
      geral,
      doMes,
      moradoresAtivos,
      ranking,
      morador,
      meta: {
        alvoKg: META_MENSAL_BAIRRO_KG,
        atingidoKg: doMes.totalKg,
        pct: percentual(doMes.totalKg, META_MENSAL_BAIRRO_KG),
      },
    }
  }, [entregas, moradores, moradorId])
}
