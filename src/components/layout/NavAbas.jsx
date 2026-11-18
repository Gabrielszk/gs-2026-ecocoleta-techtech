import { ABAS } from '../../lib/navegacao'

/**
 * Navegação principal. No celular vira uma barra fixa embaixo
 * (fácil de alcançar com o polegar); no computador fica no topo.
 */
export function NavAbas({ abaAtual, aoMudar }) {
  return (
    <nav aria-label="Seções" className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-mata-100 bg-white sm:static sm:border-0 sm:bg-transparent">
      <ul className="mx-auto grid max-w-6xl grid-cols-5 sm:flex sm:gap-2 sm:px-4 sm:pt-4">
        {ABAS.map((aba) => {
          const ativa = aba.id === abaAtual
          return (
            <li key={aba.id}>
              <button
                type="button"
                onClick={() => aoMudar(aba.id)}
                aria-current={ativa ? 'page' : undefined}
                className={`flex w-full min-h-14 flex-col items-center justify-center gap-0.5 px-1 py-2 text-xs font-bold transition-colors sm:min-h-11 sm:flex-row sm:gap-2 sm:rounded-xl sm:px-4 sm:text-base ${
                  ativa ? 'text-mata-900 sm:bg-mata-700 sm:text-white' : 'text-tinta/65 hover:text-mata-900 sm:hover:bg-mata-100'
                }`}
              >
                <svg viewBox="0 0 24 24" className={`size-6 sm:size-5 ${ativa ? 'text-mata-500 sm:text-white' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d={aba.icone} />
                </svg>
                {aba.rotulo}
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
