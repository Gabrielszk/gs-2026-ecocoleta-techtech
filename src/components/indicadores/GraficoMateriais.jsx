import { CHAVES_MATERIAIS, MATERIAIS, formatarKg, formatarReais } from '../../lib/regras'

/**
 * Gráfico de barras horizontais do estoque por material.
 * Feito só com HTML + Tailwind (sem biblioteca), com os valores escritos
 * ao lado de cada barra para não depender de cor.
 */
export function GraficoMateriais({ porMaterial, mostrarValor = false }) {
  const maior = Math.max(1, ...CHAVES_MATERIAIS.map((m) => porMaterial[m] || 0))

  return (
    <ul className="flex flex-col gap-4" aria-label="Quantidade por material">
      {CHAVES_MATERIAIS.map((m) => {
        const kg = porMaterial[m] || 0
        const largura = (kg / maior) * 100
        return (
          <li key={m} className="grid grid-cols-[6.5rem_1fr] items-center gap-3 sm:grid-cols-[8rem_1fr_auto]">
            <span className="font-bold">{MATERIAIS[m].nome}</span>
            <div className="h-8 overflow-hidden rounded-lg bg-mata-50">
              <div className={`flex h-full items-center rounded-lg ${MATERIAIS[m].cor} transition-[width] duration-700`} style={{ width: `${Math.max(largura, kg > 0 ? 4 : 0)}%` }} />
            </div>
            <span className="col-start-2 text-sm tabular-nums sm:col-start-auto sm:text-base">
              <strong>{formatarKg(kg)}</strong>
              {mostrarValor && <span className="text-tinta/70"> · {formatarReais(kg * MATERIAIS[m].precoKg)}</span>}
            </span>
          </li>
        )
      })}
    </ul>
  )
}
