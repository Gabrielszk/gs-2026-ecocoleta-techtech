/**
 * Barra de progresso acessível (role="progressbar").
 * As cores mudam com faixas de alerta quando `alertas` é informado
 * (ex.: nível do contêiner: 80% atenção, 95% cheio).
 */
export function BarraProgresso({ rotulo, valor, textoValor, alertas, tamanho = 'md' }) {
  const pct = Math.round(Math.min(100, Math.max(0, valor)))
  let cor = 'bg-mata-500'
  if (alertas && pct >= alertas.critico) cor = 'bg-red-600'
  else if (alertas && pct >= alertas.atencao) cor = 'bg-amber-500'

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-bold text-mata-900">{rotulo}</span>
        <span className="font-bold tabular-nums">{textoValor ?? `${pct}%`}</span>
      </div>
      <div
        role="progressbar"
        aria-label={rotulo}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className={`w-full overflow-hidden rounded-full bg-mata-100 ${tamanho === 'lg' ? 'h-6' : 'h-3'}`}
      >
        <div className={`h-full rounded-full transition-[width] duration-700 ${cor}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}
