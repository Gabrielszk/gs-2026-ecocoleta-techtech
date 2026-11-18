export function Cabecalho({ fonteGrande, aoAlternarFonte, modoDemonstracao }) {
  return (
    <header className="border-b-2 border-mata-100 bg-papel/95 backdrop-blur supports-[backdrop-filter]:bg-papel/80 sticky top-0 z-30">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <a href="#inicio" className="flex items-center gap-3" aria-label="EcoColeta SP, página inicial">
          <img src="/favicon.svg" alt="" className="size-10" />
          <span className="font-display text-xl font-extrabold leading-none text-mata-900 sm:text-2xl">
            EcoColeta <span className="text-mata-500">SP</span>
          </span>
        </a>
        <div className="flex items-center gap-2">
          {modoDemonstracao && (
            <span
              className="hidden rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-900 sm:inline"
              title="API externa não configurada: os dados ficam salvos só neste navegador."
            >
              Modo demonstração
            </span>
          )}
          <button
            type="button"
            onClick={aoAlternarFonte}
            aria-pressed={fonteGrande}
            className="min-h-11 rounded-xl border-2 border-mata-200 bg-white px-3 font-bold text-mata-900 hover:border-mata-500"
          >
            <span aria-hidden>{fonteGrande ? 'A−' : 'A+'}</span>
            <span className="sr-only">{fonteGrande ? 'Diminuir texto' : 'Aumentar texto'}</span>
          </button>
        </div>
      </div>
    </header>
  )
}
