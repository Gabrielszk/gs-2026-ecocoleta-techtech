const TONS = {
  claro: 'bg-white border-2 border-mata-100 text-tinta',
  escuro: 'bg-mata-900 text-white',
  destaque: 'bg-mata-100 text-mata-900',
}

/** Cartão de número grande com rótulo — usado em todos os painéis. */
export function CartaoIndicador({ rotulo, valor, detalhe, tom = 'claro' }) {
  return (
    <div className={`flex flex-col gap-1 rounded-2xl p-5 ${TONS[tom]}`}>
      <span className={`text-sm font-bold uppercase tracking-wide ${tom === 'escuro' ? 'text-mata-200' : 'text-mata-700'}`}>{rotulo}</span>
      <span className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">{valor}</span>
      {detalhe && <span className={`text-sm ${tom === 'escuro' ? 'text-white/75' : 'text-tinta/70'}`}>{detalhe}</span>}
    </div>
  )
}
