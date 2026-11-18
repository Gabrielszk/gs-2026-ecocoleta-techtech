export function Carregando({ texto = 'Carregando...' }) {
  return (
    <div role="status" className="flex items-center justify-center gap-3 py-10 text-mata-700">
      <span className="size-6 animate-spin rounded-full border-4 border-mata-200 border-t-mata-700" aria-hidden />
      <span className="font-bold">{texto}</span>
    </div>
  )
}
