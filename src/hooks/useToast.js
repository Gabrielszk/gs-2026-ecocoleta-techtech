import { useCallback, useEffect, useRef, useState } from 'react'

/** Custom hook: mensagens rápidas de sucesso/erro que somem sozinhas. */
export function useToast(duracaoMs = 3500) {
  const [toast, setToast] = useState(null)
  const timer = useRef(null)

  const mostrar = useCallback((mensagem, tipo = 'sucesso') => {
    setToast({ mensagem, tipo, id: Date.now() })
  }, [])

  useEffect(() => {
    if (!toast) return
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(null), duracaoMs)
    return () => clearTimeout(timer.current)
  }, [toast, duracaoMs])

  return { toast, mostrar, fechar: () => setToast(null) }
}
