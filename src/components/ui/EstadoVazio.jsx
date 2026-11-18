export function EstadoVazio({ titulo, descricao, acao }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-mata-200 bg-white/60 px-6 py-10 text-center">
      <svg viewBox="0 0 48 48" className="size-12 text-mata-500" aria-hidden>
        <path d="M14 18h20l-2 22H16z" fill="none" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
        <path d="M10 18h28M20 18v-5h8v5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <p className="font-display text-xl font-semibold text-mata-900">{titulo}</p>
      {descricao && <p className="max-w-sm text-tinta/75">{descricao}</p>}
      {acao}
    </div>
  )
}
