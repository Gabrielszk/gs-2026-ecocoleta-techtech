const VARIANTES = {
  primario: 'bg-mata-700 text-white hover:bg-mata-900 disabled:bg-mata-200 disabled:text-mata-700',
  secundario: 'bg-white text-mata-900 border-2 border-mata-200 hover:border-mata-500',
  perigo: 'bg-white text-red-800 border-2 border-red-200 hover:bg-red-50 hover:border-red-400',
  fantasma: 'text-mata-700 hover:bg-mata-100',
}

const TAMANHOS = {
  md: 'px-5 py-3 text-base',
  sm: 'px-3 py-2 text-sm',
}

/** Botão padrão do sistema. Área de toque mínima de 44px (acessibilidade). */
export function Botao({ variante = 'primario', tamanho = 'md', className = '', children, ...props }) {
  return (
    <button
      type="button"
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-xl font-bold transition-colors disabled:cursor-not-allowed ${VARIANTES[variante]} ${TAMANHOS[tamanho]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
