export function Toast({ toast, aoFechar }) {
  if (!toast) return null
  const erro = toast.tipo === 'erro'
  return (
    <div className="fixed inset-x-4 bottom-24 z-50 flex justify-center sm:bottom-8" aria-live="polite">
      <div
        key={toast.id}
        role={erro ? 'alert' : 'status'}
        className={`flex max-w-md items-center gap-4 rounded-2xl px-5 py-4 font-bold shadow-xl ${erro ? 'bg-red-800 text-white' : 'bg-mata-900 text-white'}`}
      >
        <span aria-hidden>{erro ? '⚠' : '✓'}</span>
        <span>{toast.mensagem}</span>
        <button type="button" onClick={aoFechar} className="ml-2 rounded-lg px-2 text-white/80 hover:text-white" aria-label="Fechar aviso">
          ✕
        </button>
      </div>
    </div>
  )
}
